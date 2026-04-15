import { useMutation } from "@tanstack/react-query";

const useUpdateEvent = () => {
  return useMutation({
    mutationFn: (eventData) => Digit.EventsServices.Update(eventData)
  })
}

export default useUpdateEvent;