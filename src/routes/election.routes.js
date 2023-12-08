const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const { verifyToken } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Election
 *   description: Election API
 * 
 * /v1/api/elections:
 *   get:
 *     summary: Get all election of user
 *     tags: [Election]
 *     description: Use to get all election
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     responses:
 *       '200':
 *         description: Get all election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message
 *                   example: Get all election successfully
 *                 metadata:
 *                   type: array
 *                   items:
 *                     schema:
 *                      $ref: '#/components/schemas/Election'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Internal server error
 *   post:
 *     summary: Create new election
 *     tags: [Election]
 *     description: Use to create new election
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of election
 *                 example: Election 1
 *               sharelink: 
 *                 type: string
 *                 description: Share link of should generate by client when create new election
 *                 example: http://client.com/election/?code=qwe123
 *               startTime:
 *                 type: string
 *                 description: Start time of election ISO 8601 format
 *                 example: 2021-05-01T00:00:00.000Z
 *               endTime:
 *                 type: string
 *                 description: End time of election ISO 8601 format
 *                 example: 2021-05-01T00:00:00.000Z
 *               questions:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Content of question
 *                       example: Question 1
 *                     choicesQuantity:
 *                       type: integer
 *                       description: Quantity of choice 
 *                       example: 2
 *                     kindQuestion:
 *                       type: integer
 *                       description: Kind of question
 *                       example: 1
 *                     isIdentify:
 *                       type: boolean
 *                       description: Is identify
 *                       example: false
 *                     startTime:
 *                       type: string
 *                       description: Start time of question ISO 8601 format
 *                       example: 2021-05-01T00:00:00.000Z 
 *                     endTime:
 *                       type: string
 *                       description: End time of question ISO 8601 format
 *                       example: 2021-05-01T00:00:00.000Z
 *                     choices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           content:
 *                             type: string
 *                             description: Content of choice
 *                             example: Choice 1
 *     responses:
 *       '200':
 *         description: Create new election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message
 *                   example: Create election successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     election:
 *                       type: object
 *                       properties:
 *                         electionID:
 *                           type: integer
 *                           description: ID of election
 *                           example: 1
 *                         title:
 *                           type: string    
 *                           description: Title of election
 *                           example: Election 1
 *                         questionQuantity:
 *                           type: integer
 *                           description: Quantity of question
 *                           example: 2
 *                         sharelink:
 *                           type: string
 *                           description: Share link of election
 *                           example: http://example.com
 *                         electionCode:
 *                           type: string
 *                           description: Code of election
 *                           example: qwe123
 *                         questions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               questionID:
 *                                 type: integer
 *                                 description: ID of question
 *                                 example: 1
 *                               kindQuestion:
 *                                 type: integer
 *                                 description: Kind of question
 *                                 example: 1
 *                               choiceQuantity:
 *                                 type: integer
 *                                 description: Quantity of choice
 *                                 example: 2
 *                               content:
 *                                 type: string
 *                                 description: Content of question
 *                                 example: Question 1
 *                               choices:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     choiceID:
 *                                       type: integer
 *                                       description: ID of choice
 *                                       example: 1
 *                                     content:
 *                                       type: string
 *                                       description: Content of choice
 *                                       example: Choice 1
 * /v1/api/elections/{id}:
 *   get:
 *     summary: Get election by ID
 *     tags: [Election]
 *     description: Use to get a specific election by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the election to retrieve
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     responses:
 *       '200':
 *         description: Get election successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Election'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Election not found
 *       '500':
 *         description: Internal server error
 *   patch:
 *     summary: Update election by ID
 *     tags: [Election]
 *     description: Use to update an election by ID, if add new question don't add questionID field, if add new choice don't add choiceID field
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the election to update
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateElectionRequest'
 *     responses:
 *       '200':
 *         description: Update election successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateElectionResponse'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Election not found
 *       '500':
 *         description: Internal server error
 *   delete:
 *     summary: Delete election by ID
 *     tags: [Election]
 *     description: Use to delete an election by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the election to delete
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     responses:
 *       '200':
 *         description: Delete election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message
 *                   example: Delete election successfully
 *                 metadata:
 *                   type: boolean
 *                   description: Is delete election
 *                   example: true
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Election not found
 *       '500':
 *         description: Internal server error
 * /v1/api/elections/code/{code}:
 *   get:
 *     summary: Get election by code
 *     tags: [Election]
 *     description: Retrieve an election by its code
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Election code to retrieve
 *     responses:
 *       '200':
 *         description: Election retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                    type: string   
 *                    description: Message
 *                    example: Get election by code successfully
 *                  metadata:
 *                    type: object
 *                    properties:
 *                     electionID:
 *                       type: integer
 *                       description: ID of election
 *                       example: 1
 *                     accountID:
 *                       type: integer
 *                       description: ID of account
 *                       example: 1
 *                     title:
 *                       type: string
 *                       description: Title of election
 *                       example: Election 1
 *                     questionQuantity:
 *                       type: integer
 *                       description: Quantity of question
 *                       example: 2
 *                     sharelink:
 *                       type: string
 *                       description: Share link of election
 *                       example: http://example.com
 *                     electionCode:
 *                       type: string
 *                       description: Code of election
 *                       example: qwe123
 *                     startTime:
 *                       type: string
 *                       description: Start time of election
 *                       example: 2021-05-01T00:00:00.000Z
 *                     endTime:
 *                       type: string
 *                       description: End time of election
 *                       example: 2021-05-01T00:00:00.000Z
 *                     createdAt:
 *                       type: string
 *                       description: Create time
 *                       example: 2021-05-07T15:02:15.000Z
 *                     updatedAt:
 *                       type: string
 *                       description: Update time
 *                       example: 2021-05-07T15:02:15.000Z
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionID:
 *                             type: integer
 *                             description: ID of question
 *                             example: 1
 *                           electionID:
 *                             type: integer
 *                             description: ID of election
 *                             example: 1
 *                           content:
 *                             type: string
 *                             description: Content of question
 *                             example: Question 1
 *                           choiceQuantity:
 *                             type: integer
 *                             description: Quantity of choice
 *                             example: 2
 *                           kindQuestion:
 *                             type: integer
 *                             description: Kind of question
 *                             example: 1
 *                           isIdentify:
 *                             type: boolean
 *                             description: Is identify
 *                             example: false
 *                           startTime:
 *                             type: string
 *                             description: Start time of question
 *                             example: 2021-05-01T00:00:00.000Z
 *                           endTime:
 *                             type: string
 *                             description: End time of question
 *                             example: 2021-05-01T00:00:00.000Z
 *                           createdAt:
 *                             type: string
 *                             description: Create time
 *                             example: 2021-05-07T15:02:15.000Z
 *                           updatedAt:
 *                             type: string
 *                             description: Update time
 *                             example: 2021-05-07T15:02:15.000Z
 *                           choices:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 choiceID:
 *                                   type: integer
 *                                   description: ID of choice
 *                                   example: 1
 *                                 questionID:
 *                                   type: integer
 *                                   description: ID of question
 *                                   example: 1
 *                                 content:
 *                                   type: string
 *                                   description: Content of choice
 *                                   example: Choice 1
 *                                 createdAt:
 *                                   type: string
 *                                   description: Create time
 *                                   example: 2021-05-07T15:02:15.000Z
 *                                 updatedAt:
 *                                   type: string
 *                                   description: Update time
 *                                   example: 2021-05-07T15:02:15.000Z
 *       '404':    
 *         description: Election not found
 *       '500':
 *         description: Internal server error
 * /v1/api/elections/{id}/vote:
 *   post:
 *     summary: Vote in an election by ID
 *     tags: [Election]
 *     description: Vote in an election by providing answers to questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election to vote in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionID:
 *                       type: integer
 *                     choices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           choiceID:
 *                             type: integer
 *     responses:
 *       '200':
 *         description: Vote election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirming successful voting
 *                   example: Vote election successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     election:
 *                       type: object
 *                       properties:
 *                         electionID:
 *                           type: integer
 *                           description: ID of the election
 *                           example: 5
 *                         questionQuantity:
 *                           type: integer
 *                           description: Quantity of questions
 *                           example: 4
 *                         title:
 *                           type: string
 *                           description: Title of the election
 *                           example: NEW ELECTION
 *                         sharelink:
 *                           type: null
 *                           description: Share link of the election
 *                         electionCode:
 *                           type: string
 *                           description: Code of the election
 *                           example: GKEIOM
 *                         startTime:
 *                           type: null
 *                           description: Start time of the election
 *                         endTime:
 *                           type: null
 *                           description: End time of the election
 *                         answers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               answerID:
 *                                 type: integer
 *                                 description: ID of the answer
 *                                 example: 5
 *                               questionID:
 *                                 type: integer
 *                                 description: ID of the question
 *                                 example: 19
 *                               choices:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     answerChoiceID:
 *                                       type: integer
 *                                       description: ID of the answer choice
 *                                       example: 14
 *                                     answerID:
 *                                       type: integer
 *                                       description: ID of the answer
 *                                       example: 5
 *                                     choiceID:
 *                                       type: integer
 *                                       description: ID of the choice
 *                                       example: 81
 *                                     updatedAt:
 *                                       type: string
 *                                       description: Update time
 *                                       example: 2023-12-08T10:01:24.047Z
 *                                     createdAt:
 *                                       type: string
 *                                       description: Create time
 *                                       example: 2023-12-08T10:01:24.047Z
 *       '400':
 *         description: Invalid data
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
*   get:
 *     summary: Get vote result for an election by ID
 *     tags: [Election]
 *     description: Get the vote result for an election by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election to get vote result
 *       - in: header
 *         name: Authorization
 *         description: Bearer token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *     responses:
 *       '200':
 *         description: Get vote election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirming successful retrieval of vote result
 *                   example: Get vote election successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     election:
 *                       type: object
 *                       properties:
 *                         electionID:
 *                           type: integer
 *                           description: ID of the election
 *                           example: 5
 *                         questionQuantity:
 *                           type: integer
 *                           description: Quantity of questions
 *                           example: 4
 *                         title:
 *                           type: string
 *                           description: Title of the election
 *                           example: NEW ELECTION
 *                         sharelink:
 *                           type: null
 *                           description: Share link of the election
 *                         electionCode:
 *                           type: string
 *                           description: Code of the election
 *                           example: GKEIOM
 *                         startTime:
 *                           type: null
 *                           description: Start time of the election
 *                         endTime:
 *                           type: null
 *                           description: End time of the election
 *                         data:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               questionID:
 *                                 type: integer
 *                                 description: ID of the question
 *                                 example: 19
 *                               content:
 *                                 type: string
 *                                 description: Content of the question
 *                                 example: Question 1
 *                               numberOfAnswer:
 *                                 type: integer
 *                                 description: Number of answers for the question
 *                                 example: 2
 *                               choices:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     choiceID:
 *                                       type: integer
 *                                       description: ID of the choice
 *                                       example: 81
 *                                     content:
 *                                       type: string
 *                                       description: Content of the choice
 *                                       example: B
 *                                     numberOfVote:
 *                                       type: integer
 *                                       description: Number of votes for the choice
 *                                       example: 2
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Election not found
 *       '500':
 *         description: Internal server error
 * components:
 *   schemas:
 *     UpdateElectionRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of election
 *           example: UPDATE ELECTION
 *         questionQuantity:
 *           type: integer
 *           description: Quantity of question
 *           example: 4
 *         sharelink:
 *           type: null
 *           description: Share link of election
 *         startTime:
 *           type: null
 *           description: Start time of election
 *         endTime:
 *           type: null
 *           description: End time of election
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UpdateQuestion'
 *       required:
 *         - electionID
 *         - accountID
 *         - title
 *         - questionQuantity
 *         - createdAt
 *         - updatedAt
 *         - questions
 * 
 *     UpdateQuestion:
 *       type: object
 *       properties:
 *         questionID:
 *           type: integer
 *           description: ID of question
 *           example: 19
 *         electionID:
 *           type: integer
 *           description: ID of election
 *           example: 5
 *         content:
 *           type: string
 *           description: Content of question
 *           example: Question 1
 *         kindQuestion:
 *           type: integer
 *           description: Kind of question
 *           example: 1
 *         choiceQuantity:
 *           type: integer
 *           description: Quantity of choice
 *           example: 4
 *         isIdentify:
 *           type: null
 *           description: Is identify
 *         startTime:
 *           type: null
 *           description: Start time of question
 *         endTime:
 *           type: null
 *           description: End time of question
 *         choices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UpdateChoice'
 * 
 *     UpdateChoice:
 *       type: object
 *       properties:
 *         choiceID:
 *           type: integer
 *           description: ID of choice
 *           example: 95
 *         questionID:
 *           type: integer
 *           description: ID of question
 *           example: 19
 *         content:
 *           type: string
 *           description: Content of choice
 *           example: NEW
 * 
 *     UpdateElectionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Message
 *           example: Update election successfully
 *         metadata:
 *           type: object
 *           properties:
 *             electionID:
 *               type: integer
 *               description: ID of election
 *               example: 5
 *             questionQuantity:
 *               type: integer
 *               description: Quantity of questions
 *               example: 4
 *             startTime:
 *               type: null
 *               description: Start time of election
 *             endTime:
 *               type: null
 *               description: End time of election
 *             title:
 *               type: string
 *               description: Title of election
 *               example: UPDATE ELECTION
 *             sharelink:
 *               type: null
 *               description: Share link of election
 *             electionCode:
 *               type: string
 *               description: Code of election
 *               example: GKEIOM
 *             questions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UpdateQuestionResponse'
 * 
 *     UpdateQuestionResponse:
 *       type: object
 *       properties:
 *         electionID:
 *           type: integer
 *           description: ID of election
 *           example: 5
 *         questionID:
 *           type: integer
 *           description: ID of question
 *           example: 19
 *         content:
 *           type: string
 *           description: Content of question
 *           example: Question 1
 *         choiceQuantity:
 *           type: integer
 *           description: Quantity of choice
 *           example: 4
 *         kindQuestion:
 *           type: integer
 *           description: Kind of question
 *           example: 1
 *         isIdentify:
 *           type: null
 *           description: Is identify
 *         startTime:
 *           type: null
 *           description: Start time of question
 *         endTime:
 *           type: null
 *           description: End time of question
 *         choices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UpdateChoiceResponse'
 * 
 *     UpdateChoiceResponse:
 *       type: object
 *       properties:
 *         choiceID:
 *           type: integer
 *           description: ID of choice
 *           example: 95
 *         content:
 *           type: string
 *           description: Content of choice
 *           example: NEW
 *         questionID:
 *           type: integer
 *           description: ID of question
 *           example: 19
 *     Election:
 *       type: object
 *       properties:
 *         electionID:
 *           type: integer
 *           description: ID of election
 *           example: 1
 *         accountID:
 *           type: integer
 *           description: ID of account
 *           example: 1
 *         title:
 *           type: string    
 *           description: Title of election
 *           example: Election 1
 *         questionQuantity:
 *           type: integer
 *           description: Quantity of question
 *           example: 2
 *         sharelink:
 *           type: string
 *           description: Share link of election
 *           example: http://example.com
 *         electionCode:
 *           type: string
 *           description: Code of election
 *           example: qwe123
 *         startTime:
 *           type: string
 *           description: Start time of election
 *           example: 2021-05-01T00:00:00.000Z
 *         endTime:
 *           type: string
 *           description: End time of election
 *           example: 2021-05-01T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           description: Create time
 *           example: 2021-05-07T15:02:15.000Z
 *         updatedAt:
 *           type: string
 *           description: Update time
 *           example: 2021-05-07T15:02:15.000Z
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionID:
 *                 type: integer
 *                 description: ID of question
 *                 example: 1
 *               kindQuestion:
 *                 type: integer
 *                 description: Kind of question
 *                 example: 1
 *               choiceQuantity:
 *                 type: integer
 *                 description: Quantity of choice
 *                 example: 2
 *               content:
 *                 type: string
 *                 description: Content of question
 *                 example: Question 1
 *               startTime:
 *                 type: string
 *                 description: Start time of question
 *                 example: 2021-05-01T00:00:00.000Z
 *               endTime:
 *                 type: string
 *                 description: End time of question
 *                 example: 2021-05-01T00:00:00.000Z
 *               createdAt:
 *                 type: string
 *                 description: Create time 
 *                 example: 2021-05-07T15:02:15.000Z
 *               updatedAt:
 *                 type: string
 *                 description: Update time
 *                 example: 2021-05-07T15:02:15.000Z
 *               choices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     choiceID:
 *                       type: integer
 *                       description: ID of choice
 *                       example: 1
 *                     content:
 *                       type: string
 *                       description: Content of choice
 *                       example: Choice 1
 *                     createdAt:
 *                       type: string
 *                       description: Create time
 *                       example: 2021-05-07T15:02:15.000Z
 *                     updatedAt:
 *                       type: string
 *                       description: Update time
 *                       example: 2021-05-07T15:02:15.000Z
 *       required:
 *         - electionID
 *         - title
 *         - questionQuantity
 *         - startTime
 *         - endTime
 *         - questions
 */

const electionController = require("../controllers/election.controller");
router.post("/:id/vote", asyncHandler(electionController.voteElection));
router.get("/code/:code", asyncHandler(electionController.getElectionByCode));

router.use(verifyToken);
router.post("/", asyncHandler(electionController.createElection));
router.get("/", asyncHandler(electionController.getAllElection));
router.get("/:id", asyncHandler(electionController.getElectionById));
router.patch("/:id", asyncHandler(electionController.updateElection));
router.delete("/:id", asyncHandler(electionController.deleteElection));
router.get("/:id/vote", asyncHandler(electionController.getVoteElection));


module.exports = router;
