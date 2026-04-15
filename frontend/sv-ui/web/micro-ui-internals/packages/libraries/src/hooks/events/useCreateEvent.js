import { useMutation } from "@tanstack/react-query";

const useCreateEvent = () => {
  return useMutation({
    mutationFn: (eventData) => Digit.EventsServices.Create(eventData)
  })
}

export default useCreateEvent;