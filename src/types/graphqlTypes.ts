export interface CurrentUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string
}

export interface UserResponse {
    currentUser: CurrentUser
}