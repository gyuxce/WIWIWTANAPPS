import { useSelector, useDispatch } from 'react-redux'
import { apiDeleteIdQuestion, apiGetQuestion, apiGetQuestionDuplicate, apiGetQuestionId, apiPostQuestion, apiPostQuestionOrder, apiPutQuestion } from 'services/QuestionService';
import { setQuestionId, setQuestionList } from 'store/question/questionSlice';

function useQuestion() {

    const dispatch = useDispatch()
    const question = useSelector((state) => state.question)


    const questionList = question.question?.list;
    const questionId = question.questionId;

    const postQuestion = async (values) => {
        try {
			const resp = await apiPostQuestion(values)
            if (resp.data) {
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }


    const postQuestionOrder = async (values,id) => {
        try {
			const resp = await apiPostQuestionOrder(values,id)
            if (resp.data) {
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const putQuestion = async (values,id) => {
        try {
			const resp = await apiPutQuestion(values,id)
            if (resp.data) {
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const deleteIdQuestion = async (values) => {
        try {
			const resp = await apiDeleteIdQuestion(values)
            if (resp.data) {
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const getQuestion = async (values) => {
        try {
			const resp = await apiGetQuestion(values)
            if (resp.data) {
                dispatch(setQuestionList(resp.data))
                return {
                    status: 'success',
                    meta: resp?.data?.meta,
                    data: resp.data?.data,
                    point_valid: resp.data?.point_valid
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const getQuestionId = async (values) => {
        try {
			const resp = await apiGetQuestionId(values)
            if (resp.data) {
                dispatch(setQuestionId(resp.data))
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const getQuestionDuplicate = async (quiz_id, main_question_id) => {
        try {
			const resp = await apiGetQuestionDuplicate(quiz_id, main_question_id)
            if (resp.data) {
                return {
                    status: 'success',
                    data: resp.data?.data
                }
            }
			
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    
    return {
        postQuestion,
        questionList,
        getQuestion,
        deleteIdQuestion,
        getQuestionId,
        questionId,
        putQuestion,
        getQuestionDuplicate,
        postQuestionOrder
    }
}

export default useQuestion