const express = require('express')
const router = express.Router({mergeParams:true})

const {getAllComments, sendComment, deleteComment} = require('../controllers/comment')

router.route('/').get(getAllComments).post(sendComment)
router.route('/:commentId').delete(deleteComment)


module.exports = router