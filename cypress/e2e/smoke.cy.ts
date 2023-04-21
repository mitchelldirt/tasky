import { faker } from "@faker-js/faker";
import { format } from "date-fns";

//TODO: If you're looking for an element on initial page load, add a timeout 1000ms or so to allow the page to load 

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login, see the default tasks, and confirm the first one is correct", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexJoin"]').should('exist').click();

    cy.get('[data-cy="joinEmail"').type(loginForm.email);
    cy.get('[data-cy="joinPassword"]').type(loginForm.password);
    cy.get('[data-cy="joinSubmit"]').click();

    cy.get('[data-cy="todayTasks"]').should('exist');
    cy.get('[data-cy="completedTasks"]').should('exist');
    cy.get('[data-cy="allTasks"]').should('exist').click();

    cy.get('[data-cy="task"]').should("have.length", 6);
    cy.get('[data-cy="task"]').first().should("contain", "Overdue task");
    cy.get('[data-cy="NonProjectNavBarBack"]').click();

    cy.get('[data-cy="profileDropdownButton"]').should('exist').click();

    cy.get('[data-cy="profileLogoutButton"]').should('exist').click();
    cy.get('[data-cy="indexLogin"]');
  });

  it("should allow you to make a task, check for the correct info, edit it, duplicate it, and delete it", () => {
    // Get today's date
    const today = new Date();

    // Set tomorrow's date by adding 1 day to today's date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const task = {
      title: faker.lorem.words(1),
      description: faker.lorem.sentences(1),
      dueDate: format(faker.date.between(tomorrow, tomorrow), "yyyy-MM-dd"),
      dueTime: "12:00",
    };

    cy.login();

    cy.setCookie("tz", "America/New_York");
    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();
    cy.get('[data-cy="homeNavBarNewTaskButton"]').should('exist').click();

    cy.wait(1000)
    cy.get('[data-cy="newTaskTitle"]').type(task.title);
    cy.get('[data-cy="newTaskDescription"]').type(task.description);
    cy.get('[data-cy="newTaskDueDate"]').type(task.dueDate);
    cy.get('[data-cy="newTaskDueTime"]').type(task.dueTime);
    cy.get('[data-cy="newTaskProject"]').select("PERSONAL");
    cy.get('[data-cy="newTaskPriorityLow"]').click();
    cy.get('[data-cy="newTaskCreate"]').click();

    cy.get('[data-cy="project-PERSONAL"]', { timeout: 1000 }).should('exist').click();

    cy.findByText(task.title).parent().parent().children().findByText("Tomorrow").should("exist");

    cy.findByText(task.title).should("exist").click();

    const newTaskTitle = "edited task that updates";

    cy.get('[data-cy="editTaskTitle"]', { timeout: 1000 }).clear().type(newTaskTitle, { force: true });
    cy.get('[data-cy="editTaskSubmit"]').click();
    cy.findByText(newTaskTitle).should("exist").click();

    cy.get('[data-cy="editTaskActionsMenu"]').should('exist').click();
    cy.get('[data-cy="editTaskDuplicate"]').should('exist').click();

    cy.findAllByText(newTaskTitle).should("have.length", 2);

    cy.findAllByText(newTaskTitle).first().click();

    cy.get('[data-cy="editTaskActionsMenu"]').should('exist').click();
    cy.get('[data-cy="editTaskDelete"]').should('exist').click();

    cy.findAllByText(newTaskTitle).should("have.length", 1);
  });

  it("Should allow you to move a task to a different project", () => {
    cy.login();

    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();
    cy.get('[data-cy="allTasks"]').should('exist').click();

    cy.wait(1000);
    cy.get('[data-cy="task"]').first().click();
    cy.get('[data-cy="editTaskProject"]').select('PERSONAL');
    cy.get('[data-cy="editTaskSubmit"]').click();

    cy.wait(1000);
    cy.get('[data-cy="task"]').first().should("contain", "PERSONAL");
  });

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

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();
    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "0");
    cy.get('[data-cy="homeNavBarNewTaskButton"]').click();

    cy.get('[data-cy="newTaskTitle"]').type(task.title);
    cy.get('[data-cy="newTaskDescription"]').type(task.description);
    cy.get('[data-cy="newTaskDueDate"]').type(task.dueDate);
    cy.get('[data-cy="newTaskDueTime"]').type(task.dueTime);
    cy.get('[data-cy="newTaskProject"]').select("PERSONAL");
    cy.get('[data-cy="newTaskPriorityLow"]').click();
    cy.get('[data-cy="newTaskCreate"]').click();

    cy.get('[data-cy="project-PERSONAL"]').should('exist').click();
    cy.findByText(task.title).should("exist");
    cy.findByText(task.title).parent().parent().parent().children().first().click();

    // wait for the task to be marked as completed in the database
    cy.wait(1000);

    cy.findByText(task.title).should("not.exist");

    cy.wait(1000);
    cy.get('[data-cy="projectNavBarBack"]').should('exist').click();

    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "1");

    cy.get('[data-cy="completedTasks"]').click();
    cy.findByText(task.title).should("exist");
  });

  it("Should allow you to search for a task and see the results", () => {
    cy.login();

    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();

    cy.get('[data-cy="homeNavBarSearchButton"]').click();

    cy.get('[data-cy="searchInput"]').type("task", { force: true });
    cy.get('[data-cy="task"]').should("have.length.at.least", 5);
  });

  it("should allow you to make a project, edit it, and delete it", () => {
    const testProject = {
      title: faker.lorem.words(2),
    };

    cy.login();

    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();

    cy.get('[data-cy="createProjectButton"]').should('exist').click();

    cy.get('[data-cy="newProjectName"]').type(testProject.title, { force: true });
    cy.get('[data-cy="newProjectGreen"]').click();
    cy.get('[data-cy="newProjectCreate"]').click();

    cy.wait(1000);
    cy.get(`[data-cy="project-${testProject.title.toUpperCase()}"]`).should('exist').click();

    cy.get(`[data-cy="projectNavEditButton"]`).should('exist').click();
    cy.get(`[data-cy="editProject"]`).should('exist').click();

    cy.get(`[data-cy="editProjectName"]`).clear().type("edited project");
    cy.get(`[data-cy="editProjectSubmit"]`).click();

    cy.get(`[data-cy="projectNavEditButton"]`).should('exist').click();
    cy.get(`[data-cy="deleteProject"]`).should('exist').click();
    cy.get(`[data-cy="deleteProjectConfirm"]`).should('exist').click();


    cy.findByText("EDITED PROJECT").should("not.exist");
  });

  it("Should allow you to complete two tasks in the two default projects and see the profile page show the correct number of completed tasks", () => {
    cy.login();

    cy.visitAndCheck("/");

    cy.wait(0);
    cy.get('[data-cy="indexViewTasks"]').should('exist').click();
    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "0");

    cy.get('[data-cy="project-PERSONAL"]').should('exist').click();
    cy.get('[data-cy="task"]').first().children().first().click();

    // wait for the task to be marked as completed in the database
    cy.wait(1000);

    cy.get('[data-cy="projectNavBarBack"]').should('exist').click();

    cy.get('[data-cy="project-WORK"]').should('exist').click();
    cy.get('[data-cy="task"]').first().children().first().click();

    // wait for the task to be marked as completed in the database
    cy.wait(1000);

    cy.get('[data-cy="projectNavBarBack"]').should('exist').click();

    cy.get('[data-cy="tasksCompletedToday"]').should("contain", "2");

    cy.get('[data-cy="profileDropdownButton"]').should('exist').click();
    cy.get('[data-cy="profileMenuButton"]').should('exist').click();

    cy.get('[data-cy="totalCompletedTasks"]').should("contain", "2");
    cy.findAllByText("1").should("have.length", 2);
  });
});
