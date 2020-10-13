interface UserInterface {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
}

type Users = { [key: string]: User };