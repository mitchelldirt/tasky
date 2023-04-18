import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  //*DONE
  it("should allow you to register and login, see the default tasks, and confirm the first one is correct", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.get('[data-cy="indexJoin"]').click();

    cy.get('[data-cy="joinEmail"').type(loginForm.email);
    cy.get('[data-cy="joinPassword"]').type(loginForm.password);
    cy.get('[data-cy="joinSubmit"]').click();

    cy.get('[data-cy="todayTasks"]');
    cy.get('[data-cy="completedTasks"]');
    cy.get('[data-cy="allTasks"]').click();

    cy.get('[data-cy="task"]').should("have.length", 6);
    cy.get('[data-cy="task"]').first().should("contain", "Overdue task");
    cy.get('[data-cy="NonProjectNavBarBack"]').click();

    cy.get('[data-cy="profileDropdownButton"]').click();

    cy.get('[data-cy="profileLogoutButton"]').click();
    cy.get('[data-cy="indexLogin"]');
  });


  it("should allow you to make a task, edit it, delete it, and duplicate it", () => {
    cy.login();

    cy.visitAndCheck("/");

  });

  //*DONE
  it("Should allow you to move a task to a different project", () => {
    cy.login();

    cy.visitAndCheck("/");

    cy.get('[data-cy="indexViewTasks"]').click();
    cy.get('[data-cy="allTasks"]').click();

    cy.get('[data-cy="task"]').first().click();
    cy.get('[data-cy="editTaskProject"]').select('PERSONAL');
    cy.get('[data-cy="editTaskSubmit"]').click();

    cy.get('[data-cy="task"]').first().should("contain", "PERSONAL");
  });

  it("Should allow you to complete a task, see the current day completed task count go up by one, and see the task in the completed tasks list", () => {
    cy.login();

    cy.visitAndCheck("/");
  });

  it("Should allow you to search for a task and see the results", () => {
    cy.login();

    cy.visitAndCheck("/");
  });

  it("should allow you to make a project, edit it, and delete it", () => {
    const testProject = {
      title: faker.lorem.words(1),
      body: faker.lorem.sentences(1),
    };
    cy.login();

    cy.visitAndCheck("/");
  });

  it("Should allow you to complete two tasks in the two default projects and see the profile page show the correct number of completed tasks", () => {
    cy.login();

    cy.visitAndCheck("/");
  });
});
