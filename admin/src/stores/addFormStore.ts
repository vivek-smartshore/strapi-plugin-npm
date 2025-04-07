import { create } from 'zustand'

interface AddFormStore {
  showModal: boolean
  setShowModal: (val: boolean) => void
}

const useAddFormStore = create<AddFormStore>((set) => ({
  showModal: false,
  setShowModal: (val: boolean) => set({ showModal: val }),
}))
export default useAddFormStore
