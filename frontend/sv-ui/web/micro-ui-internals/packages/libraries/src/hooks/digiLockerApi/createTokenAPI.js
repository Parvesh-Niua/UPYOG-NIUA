import { DigiLockerService } from "../../services/elements/DigiLocker";
import { useMutation } from "@tanstack/react-query";

const createTokenAPI = (type) => {

  return useMutation((data) => {
    DigiLockerService.token(data)});
 }

export default createTokenAPI;
