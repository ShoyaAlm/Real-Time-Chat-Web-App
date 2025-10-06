const express = require('express')
const router = express.Router({mergeParams:true})

const {getAllComments, sendComment, editComment, deleteComment} = require('../controllers/comment')

router.route('/').get(getAllComments).post(sendComment)
router.route('/:commentId').patch(editComment).delete(deleteComment)


module.exports = router