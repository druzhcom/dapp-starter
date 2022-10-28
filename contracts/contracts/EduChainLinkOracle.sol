//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract EduChainLinkOracle is VRFConsumerBase {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    struct Student {
        uint256 studentId;
        uint256 groupId;
        uint256 random;
        bool isLucky;
    }

    Counters.Counter private studentId;
    mapping(uint256 => Student) private students;
    mapping(bytes32 => uint256) private studentsRandomnessRequest;
    mapping(uint256 => uint256) playersCount;
    bytes32 private keyHash; // нужно Чейнлинку
    uint256 public fee; // нужно Чейнлинку
    address private admin;

    event RandomnessRequested(bytes32, uint256);
    event LuckyStudent(uint256, uint256, bytes32, uint256);
    event StudentCreated(uint256, uint256);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    /**
     * Конструктор наследует VRFConsumerBase
     * @param vrfCoordinator адрес контракта VRFCoordinator.
     * @param link адрес контракта токена LINK.
     * @param _keyhash ID открытого ключа, на основе которого генерируется случайность
     * @param _fee сумма LINK, которую нужно отправить с запросом.
     */
    constructor(
        address vrfCoordinator,
        address link,
        bytes32 _keyhash,
        uint256 _fee
    ) VRFConsumerBase(vrfCoordinator, link) {
        keyHash = _keyhash;
        fee = _fee;
        admin = msg.sender;
    }

    function createStudent(uint256 _studentId, uint256 _groupId)
        public
        payable
        onlyAdmin
    {
        Student memory student = Student({
            studentId: _studentId, //studentId.current(),
            groupId: _groupId,
            random: 0,
            isLucky: false
        });
        students[studentId.current()] = student;
        studentId.increment();
        emit StudentCreated(student.studentId, student.groupId);
    }

    function chooseLucky(uint256 _studentId) public {
        Student storage student = students[_studentId];
        require(!student.isLucky, "Student already lucky");

        // LINK - это внутренний интерфейс для токена Link, находящегося внутри VRFConsumerBase
        // Здесь мы используем метод balanceOf из этого интерфейса, чтобы убедиться, что наш
        // контракт имеет достаточно ссылок, чтобы мы могли запросить VRFCoordinator о случайности
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        // Отправляем запрос координатору VRF.
        // requestRandomness - это функция в VRFConsumerBase
        // запускает процесс генерации случайности

        bytes32 requestId = requestRandomness(keyHash, fee);

        // когда случайное число вернется в функции
        // fulfillRandomness, оно будет иметь только requestId
        // и случайное число, поэтому без сопоставления мы не сможем определить победителя нужной лотереи.
        studentsRandomnessRequest[requestId] = _studentId;
        emit RandomnessRequested(requestId, _studentId);
    }

    /**
     * fulfillRandomness вызывается VRFCoordinator, когда он получает действительное доказательство VRF.
     * Эта функция переопределяется, чтобы действовать на основе случайного числа, сгенерированного Chainlink VRF.
     * @param requestId это уникальный идентификатор запроса, который мы отправили координатору VRF.
     * @param randomness это случайная целочисленное беззнаковое значение, сгенерированное и возвращеное нам координатором VRF.
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 _studentId = studentsRandomnessRequest[requestId];
        Student storage student = students[_studentId];

        uint256 winner = randomness;

        student.isLucky = true;
        student.random = randomness;

        emit LuckyStudent(winner, randomness, requestId, student.studentId);
        // delete studentsRandomnessRequest[requestId];
    }

    function isLucky(uint256 _studentId) public returns (bool) {
        return students[_studentId].isLucky;
    }

    function getRandom(uint256 _studentId) public returns (uint256) {
        return students[_studentId].random;
    }
}
