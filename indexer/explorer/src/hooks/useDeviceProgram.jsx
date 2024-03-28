import { Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import idl from "../idl/device_did.json";

export const DEVICE_DID_PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID

export const initProgram = (program_id) => {

  const provider = useAnchorProvider();
  const program = new Program(idl, program_id, provider);
  return program;
};

const useDeviceProgram = () => {
  console.log("useDeviceProgram PROGRAM_ID: ", DEVICE_DID_PROGRAM_ID);
  const provider = useAnchorProvider();
  const program = new Program(idl, DEVICE_DID_PROGRAM_ID, provider);
  return program;
};

export default useDeviceProgram;
