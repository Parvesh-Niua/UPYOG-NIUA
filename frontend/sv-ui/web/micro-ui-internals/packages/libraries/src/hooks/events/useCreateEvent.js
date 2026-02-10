import { useMutation } from "@tanstack/react-query";

const useCreateEvent = () => {
  return useMutation(eventData => Digit.EventsServices.Create(eventData))
}

export default useCreateEvent; 