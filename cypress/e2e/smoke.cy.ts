import { faker } from "@faker-js/faker";
import { format } from "date-fns";

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

    // Not sure if this is the best way to do this
    cy.wait(1000);

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

  //*DONE
  it("should allow you to make a task, check for the correct info, edit it, duplicate it, and delete it", () => {
    const task = {
      title: faker.lorem.words(1),
      description: faker.lorem.sentences(1),
      dueDate: format(faker.date.soon(1), "yyyy-MM-dd"),
      dueTime: "12:00",
    };

    cy.login();

    cy.setCookie("tz", "America/New_York");
    cy.visitAndCheck("/");

    cy.get('[data-cy="indexViewTasks"]').click();
    cy.get('[data-cy="homeNavBarNewTaskButton"]').click();

    cy.get('[data-cy="newTaskTitle"]').type(task.title);
    cy.get('[data-cy="newTaskDescription"]').type(task.description);
    cy.get('[data-cy="newTaskDueDate"]').type(task.dueDate);
    cy.get('[data-cy="newTaskDueTime"]').type(task.dueTime);
    cy.get('[data-cy="newTaskProject"]').select("PERSONAL");
    cy.get('[data-cy="newTaskPriorityLow"]').click();
    cy.get('[data-cy="newTaskCreate"]').click();

    cy.get('[data-cy="project-PERSONAL"]').click();

    cy.findByText(task.title).parent().parent().children().findByText("Tomorrow").should("exist");
    cy.findByText(task.title).parent().parent().children().findByText("4:00 PM").should("exist");

    cy.findByText(task.title).should("exist").click();

    const newTaskTitle = "edited task that updates";

    cy.get('[data-cy="editTaskTitle"]').clear().type(newTaskTitle);
    cy.get('[data-cy="editTaskSubmit"]').click();
    cy.findByText(newTaskTitle).should("exist").click();

    cy.get('[data-cy="editTaskActionsMenu"]').click();
    cy.get('[data-cy="editTaskDuplicate"]').click();

    cy.findAllByText(newTaskTitle).should("have.length", 2);

    cy.findAllByText(newTaskTitle).first().click();

    cy.get('[data-cy="editTaskActionsMenu"]').click();
    cy.get('[data-cy="editTaskDelete"]').click();

    cy.findAllByText(newTaskTitle).should("have.length", 1);
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

  //*DONE
  it("Should allow you to complete a task, see the current day completed task count go up by one, and see the task in the completed tasks list", () => {
    const task = {
      title: faker.lorem.words(1),
      description: faker.lorem.sentences(1),
      dueDate: format(faker.date.future(), "yyyy-MM-dd"),
      dueTime: "12:00",
    };

    cy.login();

    cy.setCookie("tz", "America/New_York");
    cy.visitAndCheck("/");

    cy.get('[data-cy="indexViewTasks"]').click();
    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "0");
    cy.get('[data-cy="homeNavBarNewTaskButton"]').click();

    cy.get('[data-cy="newTaskTitle"]').type(task.title);
    cy.get('[data-cy="newTaskDescription"]').type(task.description);
    cy.get('[data-cy="newTaskDueDate"]').type(task.dueDate);
    cy.get('[data-cy="newTaskDueTime"]').type(task.dueTime);
    cy.get('[data-cy="newTaskProject"]').select("PERSONAL");
    cy.get('[data-cy="newTaskPriorityLow"]').click();
    cy.get('[data-cy="newTaskCreate"]').click();

    cy.get('[data-cy="project-PERSONAL"]').click();
    cy.findByText(task.title).should("exist");
    cy.findByText(task.title).parent().parent().parent().children().first().click();

    cy.findByText(task.title).should("not.exist");
    cy.get('[data-cy="projectNavBarBack"]').click();

    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "1");

    cy.get('[data-cy="completedTasks"]').click();
    cy.findByText(task.title).should("exist");
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
