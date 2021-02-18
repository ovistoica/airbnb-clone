import { createStore, action, Action } from "easy-peasy";
interface ModalModel {
  showModal: boolean;
  showLoginModal: boolean;
  showRegistrationModal: boolean;
  setShowModal: Action<ModalModel, void>;
  setShowRegistrationModal: Action<ModalModel, void>;
  setHideModal: Action<ModalModel, void>;
  setShowLoginModal: Action<ModalModel, void>;
}

interface UserModel {
  user?: string;
  setUser: Action<UserModel, string | undefined>;
}

export interface StoreModel {
  modals: ModalModel;
  user: UserModel;
}

const modalsModel: ModalModel = {
  showModal: false,
  showLoginModal: false,
  showRegistrationModal: false,
  setShowModal: action((state) => {
    state.showModal = true;
  }),
  setHideModal: action((state) => {
    state.showModal = false;
  }),
  setShowLoginModal: action((state) => {
    state.showModal = true;
    state.showLoginModal = true;
    state.showRegistrationModal = false;
  }),
  setShowRegistrationModal: action((state) => {
    state.showModal = true;
    state.showLoginModal = false;
    state.showRegistrationModal = true;
  }),
};

const userModel: UserModel = {
  user: undefined,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
};

export default createStore<StoreModel>({
  modals: modalsModel,
  user: userModel,
});
