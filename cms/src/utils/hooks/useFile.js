const { apiPostFile } = require("services/FileService")

function useFile () {
    const postFile = async (values) => {
        try {
            const resp = await apiPostFile(values)
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
        postFile
    }
}

export default useFile