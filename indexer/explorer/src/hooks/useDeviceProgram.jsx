import { Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import idl from "../idl/device_did.json";

export const DEVICE_DID_PROGRAM_ID =
  "1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg";

const useDeviceProgram = () => {
  const provider = useAnchorProvider();
  const program = new Program(idl, DEVICE_DID_PROGRAM_ID, provider);
  return program;
};

export default useDeviceProgram;
