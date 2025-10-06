export type MachineContext = {
  objectName?: string
  userId: string
}

export type MachineInput = {
  userId: string
}

export type MachineEvents =
  | {
    type: 'ADD_IMAGE'
    file: File
  }
  | {
    type: 'REMOVE_IMAGE'
  }
