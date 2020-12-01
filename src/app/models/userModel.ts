export class User implements UserInterface {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    currency: string;

    constructor() {
        this.uuid = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.currency = ''
    }

    static of() {
        return new User();
    }

    static from(userData: object) {
        return Object.assign(new User, userData);
    }

    withUUID(uuid: string) {
        this.uuid = uuid;
        return this;
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

    withCurrency(currency: string) {
        this.currency = currency;
        return this;
    }
}