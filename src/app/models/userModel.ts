class User implements UserInterface {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(uuid: string) {
        this.uuid = uuid;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
    }

    static of(uuid: string) {
        return new User(uuid);
    }

    withFirstName(firstName: string) {
        this.firstName = firstName;
        return this;
    }

    withLastName(lastName: string) {
        this.lastName = lastName;
        return this;
    }

    withEmail(email: string) {
        this.email = email;
        return this;
    }
}