export {}

describe('empty spec', () => {
  it('should load homepage', () => {
    cy.visit('http://localhost:3000')
  });
  it('should find menu', () =>{
    cy.visit('http://localhost:3000')
    cy.get("#hamburger-menu-icon").click()
  });
  it('should find menu, click patient list and goto patient list page', () =>{
    cy.visit('http://localhost:3000')
    cy.get("#hamburger-menu-icon").click();
    cy.get("[href=\"/\"]").click();
    cy.get("#heading").contains("Patient List");
  })
  it('should find menu, click patient list and goto csv upload page', () =>{
    cy.visit('http://localhost:3000')
    cy.get("#hamburger-menu-icon").click();
    cy.get("[href=\"/upload\"]").click();
    cy.get("#heading").contains("Upload CSV");
  })
})