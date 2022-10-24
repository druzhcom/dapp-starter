import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import EduDAOArtifact from '../artifacts/contracts/EduToken.sol/EduToken.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function EduDAO(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [eduDaoContract, setEduDAOContract] = useState<Contract>();
  const [eduDaoContractAddr, setEduDAOContractAddr] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');
  const [participantAddr, setParticipantAddress] = useState<string>('');
  const [erc20Token, seterc20Token] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!eduDaoContract) {
      return;
    }

    async function getParticipants(eduDaoContract: Contract): Promise<void> {
      const _participents = await eduDaoContract.getParticipants();
      setParticipants(_participents);
    }
    getParticipants(eduDaoContract);
  }, [eduDaoContract, participants]);


  function handleInstContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    async function deployGreeterContract(): Promise<void> {

      const EduDAO = new ethers.Contract("0x2d1a265ad607bA61aF936328602d0C6Bd026A4F3", EduDAOArtifact.abi, signer);

      console.log("provider: ", context)

      try {
        setEduDAOContract(EduDAO);
        window.alert(`EduDAO deployed to: ${EduDAO.address}`);
        setEduDAOContractAddr(EduDAO.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployGreeterContract();
  }

  function handlePartAddrhange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setParticipantAddress(event.target.value);
  }

  function handleErc20Chanege(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    seterc20Token(event.target.value);
  }

  function handleAmountChanege(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAmount(event.target.value);
  }

  function handleAddTokenSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!eduDaoContract) {
      window.alert('Undefined eduDaoContract');
      return;
    }

    if (!participantAddr) {
      window.alert('Greeting cannot be empty');
      return;
    }


    async function submitAddToken(eduDaoContract: Contract): Promise<void> {
      const estimation = await eduDaoContract.estimateGas.addErc20Token(participantAddr, erc20Token, amount, {gasLimit: 5000000});
      console.log("estimation: ", Number(estimation));

      // try {
        const setAddtokenTxn = await eduDaoContract.addErc20Token(participantAddr, erc20Token, amount, {gasLimit: estimation});
        await setAddtokenTxn.wait();

        // if (newGreeting !== eduDaoContractAddr) {
        //   setParticipants(newGreeting);
        // }
      // } catch (error: any) {
      //   window.alert(
      //     'Error!' + (error && error.message ? `\n\n${error.message}` : '')
      //   );
      // }
    }

    submitAddToken(eduDaoContract);
  }

  return (
    <>
      <StyledDeployContractButton
        disabled={!active || eduDaoContract ? true : false}
        style={{
          cursor: !active || eduDaoContract ? 'not-allowed' : 'pointer',
          borderColor: !active || eduDaoContract ? 'unset' : 'blue'
        }}
        onClick={handleInstContract}
      >
        Inst EduDAO Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {eduDaoContractAddr ? (
            eduDaoContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current greeting</StyledLabel>
        <div>
          {eduDaoContractAddr ? eduDaoContractAddr : <em>{`<Contract not yet deployed>`}</em>}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="participantAddr">Send gYDAO token</StyledLabel>
        <StyledInput
          id="participantAddr"
          type="text"
          placeholder={eduDaoContractAddr ? '' : '<Contract not yet deployed>'}
          onChange={handlePartAddrhange}
          style={{ fontStyle: true ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledInput
          id="erc20Token"
          type="text"
          placeholder={eduDaoContractAddr ? '' : '<Contract not yet deployed>'}
          onChange={handleErc20Chanege}
          style={{ fontStyle: true ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledInput
          id="amount"
          type="text"
          placeholder={eduDaoContractAddr ? '' : '<Contract not yet deployed>'}
          onChange={handleAmountChanege}
          style={{ fontStyle: true ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !eduDaoContract ? true : false}
          style={{
            cursor: !active || !eduDaoContract ? 'not-allowed' : 'pointer',
            borderColor: !active || !eduDaoContract ? 'unset' : 'blue'
          }}
          onClick={handleAddTokenSubmit}
        >
          Submit
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}
