import { GetRewardDetail } from "../../../redux/services/user.api"


export const GetRewardDetailAction = () =>{
    try {
        const response = GetRewardDetail();
        return response 
    } catch (error) {
         return error
    }
}