import Button from "./Button";

const ConfirmDeleteContent = ({
  handleDirectClose,
  modalData,
  deleteMutate,
  message,
}) => {
  return (
    <div className="">
      <h2 className="dark:text-white text-black text-lg font-semibold mb-4">
        Delete Confirmation
      </h2>
      <p className="text-gray-400 mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <Button
          isLoading={deleteMutate.isPending}
          variant={"soild"}
          onClick={() => {
            // Perform the delete operation here
            deleteMutate.mutate(modalData.id);
          }}
        >
          Confirm
        </Button>
        <Button variant={"link"} onClick={handleDirectClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDeleteContent;
