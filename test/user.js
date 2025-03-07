//test login function

it('should return a user when given a valid username and password', async () => {
    const mockUser = {
        UserId: 1,
        userName: 'Xx_Andrew_xX',
        firstName: 'Andrew',
        lastName: 'Benham',
        passwordHash: '54321',
        //lastLogin: '2025-03-06',
    };
    dbStub.resolves({ rows: [mockUser] });
    const user = await login('Xx_Andrew_xX', '54321');
    expect(user.firstname).to.equal('Andrew');
    expect(user.lastname).to.equal('Benham');
});

//test wrong login

it('should return undefined for invalid login credentials', async () => {
    dbStub.resolves({ rows: [] });
    const user = await login('wronguser', 'wrongpass');
    expect(user).to.be.undefined;
});
