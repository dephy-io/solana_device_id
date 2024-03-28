import { Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import idl from "../idl/device_did.json";

export const DEVICE_DID_PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID

const useDeviceProgram = () => {
  console.log("PROGRAM_ID: ", DEVICE_DID_PROGRAM_ID);
  const provider = useAnchorProvider();
  const program = new Program(idl, DEVICE_DID_PROGRAM_ID, provider);
  return program;
};

export default useDeviceProgram;
