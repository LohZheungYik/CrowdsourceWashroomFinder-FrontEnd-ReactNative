// utils/globals.ts
export class Globals {
  private static instance: Globals;
  private loggedInId: number | null = null;
  private loggedInEmail: string | null = null;

  private constructor() {}

  static getInstance(): Globals {
    if (!Globals.instance) {
      Globals.instance = new Globals();
    }
    return Globals.instance;
  }

  setLoggedInId(id: number) {
    this.loggedInId = id;
  }
  getLoggedInId() {
    return this.loggedInId;
  }

  setLoggedInEmail(email: string) {
    this.loggedInEmail = email;
  }
  getLoggedInEmail() {
    return this.loggedInEmail;
  }
}