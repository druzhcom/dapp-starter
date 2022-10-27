//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract EduOracle is VRFConsumerBase {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    struct Student {
        uint256 studentId;
        uint256 groupId;
        bool isLucky;
    }

    Counters.Counter private studentId;
    mapping(uint256 => Student) private students;
    mapping(bytes32 => uint256) private studentsRandomnessRequest;
    mapping(uint256 => uint256) playersCount;
    bytes32 private keyHash; // нужно Чейнлинку
    uint256 private fee; // нужно Чейнлинку
    address private admin;

    event RandomnessRequested(bytes32, uint256);
    event LuckyStudent(bytes32, uint256);
    event StudentCreated(uint256, uint256);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

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

    function createStudent(uint256 _groupId) public payable onlyAdmin {
        Student memory student = Student({
            studentId: studentId.current(),
            groupId: _groupId,
            isLucky: false
        });
        students[studentId.current()] = student;
        studentId.increment();
        emit StudentCreated(student.studentId, student.groupId);
    }

    function isLucky(uint256 _studentId) public onlyAdmin {
        // Проверяем баланс для оплаты сбора
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        bytes32 requestId = requestRandomness(keyHash, fee);

        // потому что когда случайное число вернется в функции
        // fulfillRandomness, оно будет иметь только requestId
        // и случайное число, поэтому без сопоставления мы не сможем определить победителя нужной лотереи.
        studentsRandomnessRequest[requestId] = _studentId;
        emit RandomnessRequested(requestId, _studentId);
    }

    // Эта функция из другого смарт-контракта
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 _studentId = studentsRandomnessRequest[requestId];
        Student storage student = students[_studentId];

        uint256 winner = randomness;

        student.isLucky = true;

        if (winner > 8) {
            delete studentsRandomnessRequest[requestId];

            emit LuckyStudent(requestId, student.studentId);
        }
    }
}
