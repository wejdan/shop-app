import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaTimes } from "react-icons/fa";
import { Transition, TransitionGroup } from "react-transition-group";

const ModalContext = createContext();

export function useModalWindow() {
  return useContext(ModalContext);
}

function getModalTransitionStyles(state) {
  switch (state) {
    case "exiting":
    case "exited":
      return "opacity-0";
    case "entering":
    case "entered":
      return "opacity-100";
    default:
      return "";
  }
}

function Modal({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (name, data = null) => {
    setModals((currentModals) => [...currentModals, { name, data }]);
  };

  const closeModal = (name) => {
    setModals((currentModals) =>
      currentModals.filter((modal) => modal.name !== name)
    );
  };
  useEffect(() => {
    if (modals.length > 0) {
      // Modal is open
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      // No modals are open
      document.body.style.overflow = ""; // Enable scrolling
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [modals.length]);
  const onClose = (name) => () => closeModal(name);
  const closeAllModals = () => {
    setModals([]);
  };
  return (
    <ModalContext.Provider
      value={{ modals, closeAllModals, openModal, closeModal, onClose }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens, children, data }) {
  const { openModal } = useContext(ModalContext);
  return React.cloneElement(children, {
    onClick: () => openModal(opens, data),
  });
}

function Window({ name, children, isSmall, isPending }) {
  const { modals, onClose } = useContext(ModalContext);
  const modalContentRef = useRef(null);
  const modalData = modals.find((modal) => modal.name === name)?.data;
  const handleCloseOnClickOutside = (event) => {
    if (isPending) return; // Prevent closing if there's a pending operation
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target)
    ) {
      onClose(name)();
    }
  };
  const handleDirectClose = () => {
    if (isPending) return; // Prevent direct closing if there's a pending operation

    onClose(name)();
  };

  const isActive = modals.some((modal) => modal.name === name);
  return isActive ? (
    <Transition in={isActive} timeout={300} unmountOnExit>
      {(state) => (
        <div
          className={`z-[500] fixed  inset-0 bg-slate-200/20 dark:bg-slate-200/10 backdrop-blur-sm flex justify-center items-center min-h-screen transition-all duration-200 ${getModalTransitionStyles(
            state
          )}`}
          onClick={handleCloseOnClickOutside}
        >
          <div
            ref={modalContentRef}
            className={` ${
              isSmall ? "" : "w-2/3"
            } py-8 bg-white dark:bg-gray-800 px-16 py-7 shadow-lg relative rounded-md`}
          >
            <FaTimes
              className="cursor-pointer absolute right-3 top-3 text-gray-600"
              onClick={handleDirectClose}
            />

            {React.cloneElement(children, {
              handleDirectClose,
              modalData: modalData,
            })}
          </div>
        </div>
      )}
    </Transition>
  ) : null;
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
