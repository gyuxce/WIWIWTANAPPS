const { useDispatch, useSelector } = require("react-redux");
const { apiGetPageHome, apiPutPageHome } = require("services/Pages/HomeService");
const { setHomeSectionList } = require("store/pages/home/homeSlice");

function usePageHome() {
    const dispatch = useDispatch()
    const home = useSelector((state) => state.pageHome)

    const sectionList = home?.sectionList
    
    const getPageHome = async () => {
        try {
            const resp = await apiGetPageHome()
            if (resp.data) {
                dispatch(setHomeSectionList(resp.data))
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
    
    const putPageHome = async (data, id) => {
        try {
            const resp = await apiPutPageHome(data, id)
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
        sectionList,
        getPageHome,
        putPageHome
    }
}

export default usePageHome