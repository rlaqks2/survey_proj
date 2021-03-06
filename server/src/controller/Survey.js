import moment from 'moment';
import db from '../db';
import Helper from './Helper';

const Survey = {
    /**
     * Create A Survey
     * @param {object} req
     * @param {object} res
     * @returns {object} survey object
     */
    async save(req, res) {
      console.log('Survey save!');
      const saveQuery = `INSERT INTO
      surveys(surveyid, surveyname, slug, responders, userid, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
        const values = [
            "survey-" + Helper.generateId(),
            req.body.surveyname,
            req.body.surveyslug,
            "",
            "",
            moment(new Date()),
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(saveQuery, values);
            return res.status(200).send(rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    },
    /**
     * Get All Surveys
     * @param {object} req
     * @param {object} res
     * @returns {object} survey array
     */
    async getAll(req, res) {
        const findAllQuery = `SELECT * FROM surveys`;
        console.log('dashboard list');
        // const findAllQuery = `SELECT * FROM surveys where userid = $1`;
        try {
            const { rows, rowCount } = await db.query(findAllQuery);
            // const { rows, rowCount } = await db.query(findAllQuery, [req.user.username]);
            return res.status(200).send({ rows, rowCount });
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    /**
     * Check Unique Slug
     * @param {object} req
     * @param {object} res
     * @returns {object} survey object
     */
    async checkUniqueSlug(req, res) {
        const text = `SELECT * FROM surveys WHERE slug = $1`;
        try {
            const { rows, rowCount } = await db.query(text, [req.body.surveyslug]);
            return res.status(200).send({ rows, rowCount });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Get A Survey
     * @param {object} req
     * @param {object} res
     * @returns {object} survey object
     */
    async getOne(req, res) {
        // const text = `SELECT * FROM surveys WHERE slug = $1 AND userid = $2`;
        const text = `SELECT * FROM surveys WHERE slug = $1`;
        try {
            const { rows } = await db.query(text, [req.body.slug]);
            // const { rows } = await db.query(text, [req.body.slug, req.user.username]);
            if (!rows[0]) {
                return res.status(200).send({ 'message': 'survey not found' });
            }
            return res.status(200).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Update A Survey
     * @param {object} req
     * @param {object} res
     * @returns {object} updated survey
     */
    async update(req, res) {
        console.log('Survey update Start!');
        const findOneQuery = `SELECT * FROM surveys WHERE slug=$1 AND userid = $2`;
        const updateOneQuery = `UPDATE survey 
        SET surveyname = $1, updated_at = $2
        WHERE slug = $3 AND userid = $4 returning *`;
        try {
            const { rows } = await db.query(findOneQuery, [req.body.slug, req.user.username]);
            console.log(rows);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'survey not found' });
            }
            const values = [
                req.body.surveyname || rows[0].surveyname,
                moment(new Date()),
                req.body.slug,
                req.user.username
            ];
            const response = await db.query(updateOneQuery, values);
            return res.status(200).send(response.rows[0]);
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    /**
     * Share A Survey
     * @param {object} req
     * @param {object} res
     * @returns {object} shared survey
     */
    async share(req, res) {
        const findOneQuery = `SELECT * FROM surveys WHERE slug=$1 AND userid = $2`;
        const shareOneQuery = `UPDATE surveys 
        SET responders = $1, updated_at = $2
        WHERE slug = $3 AND userid = $4 returning *`;
        try {
            const { rows } = await db.query(findOneQuery, [req.body.slug, req.user.username]);
            if (!rows[0]) {
                return res.status(204).send({ message: 'survey not found' });
            }
            let oldResponders = rows[0].responders.split(',');
            if (oldResponders.includes(req.body.email)) {
                return res.status(200).send({ mycode: 2, message: 'already shared with this user' });
            } else {
                let newResponder = req.body.email + ','
                const values = [
                    rows[0].responders + newResponder,
                    moment(new Date()),
                    req.body.slug,
                    req.user.username
                ];
                const response = await db.query(shareOneQuery, values);
                return res.status(200).send(response.rows[0]);
            }
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    /**
     * Delete A Survey
     * @param {object} req
     * @param {object} res
     * @returns {void} return statuc code 204
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM surveys WHERE surveyid = $1 AND userid = $2  returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.body.surveyid, req.user.username]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'survey not found' });
            }
            return res.status(200).send({ 'message': 'deleted' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default Survey;