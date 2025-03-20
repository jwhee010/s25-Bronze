//test login function

const { expect } = require('chai'); // Import Chai's "expect" style
const { login } = require('http://localhost:80/login'); // Import the function for testing


// const { express } = require('express');
// const { cors } = require('cors')

// const app = express();
// app.use(cors());
// app.use(express.json())

// const db = require('./config/db')

/////////

describe('Login Function', () => {
    it('should return a user when given valid username and password', async () => {
        const mockUser = {
            UserId: 5,
            userName: 'Mike',
            firstName: 'Michael',
            lastName: 'Nguyen',
            passwordHash: 'bestpassword'
        };

        // Mocking a simple database response
        const dbStub = {
            query: async () => ({ rows: [mockUser] }) // Fake database query
        };

        const user = await login('Mike', 'bestpassword', dbStub);

        // Use Chai's expect-style assertions
        expect(user).to.have.property('UserId', '5');
        expect(user).to.have.property('userName', 'Mike');
        expect(user).to.have.property('firstName', 'Michael');
        expect(user).to.have.property('lastName', 'Nguyen');
        expect(user).to.have.property('passwordHash', 'bestpassword');
        expect(user).to.include.keys('UserId', 'userName');
    });
});

//////////////////////

// const request = require("supertest");
// const app = require("http://localhost:80/login"); // Import Express app without starting a server

// describe("POST /login", () => {
//     it("should return a token for valid credentials", async () => {
//         const response = await request(app)
//             .post("/login")
//             .send({ username: "testuser", password: "password123" });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty("token");
//     });

//     it("should return 401 for invalid credentials", async () => {
//         const response = await request(app)
//             .post("/login")
//             .send({ username: "wronguser", password: "wrongpass" });

//         expect(response.status).toBe(401);
//         expect(response.body).toHaveProperty("error", "Invalid credentials");
//     });
// });



// //test wrong login

// it('should return undefined for invalid login credentials', async () => {
//     dbStub.resolves({ rows: [] });
//     const user = await login('wronguser', 'wrongpass');
//     expect(user).to.be.undefined;
// });
