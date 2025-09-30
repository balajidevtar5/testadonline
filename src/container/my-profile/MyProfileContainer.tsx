import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { RootState } from "../../redux/reducer";
import { updateProfileAPI } from "../../redux/services/user.api";
import MyProfileScene from "./MyProfileScene";
import { message } from "antd";
import { useProfileValidation } from "../../schema/ProfileSchema";

const MyProfileContainer = () => {
    const ProfileSchema = useProfileValidation();
    const { register, formState, watch, control, handleSubmit,setValue } = useForm({
        resolver: yupResolver(ProfileSchema),
    });
    const  {data:loginUserData} = useSelector((state: RootState) => state.loginUser);
    const {position} = useContext(LayoutContext)
    const watchField = watch();
    
    const onSubmit = async(values) => {
        try {
            const payload={
                Id : 2,
                Firstname : values?.Firstname,
                Lastname : values?.Lastname,
                MobileNo :values?.MobileNo,
                LocationId : values?.CityId?.id,
                Latitude : position?.latitude,
                Longitude : position?.longitude
            }
           
            const response = await updateProfileAPI(payload)
            if(response){
                message.success(response.message);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        if (loginUserData?.data?.length > 0) {
            setValue("Firstname", loginUserData.data[0]?.firstname);
            setValue("Lastname", loginUserData.data[0]?.lastname);
            setValue("MobileNo", loginUserData.data[0]?.mobileno);
            // const cityValues = CITIES.find((elm)=>elm.id === loginUserData.data[0]?.cityid )

            // console.log("cityValues",cityValues);
            
        //    setValue("CityId",cityValues)
        }
    }, [loginUserData]);
    return (
        <MyProfileScene
            {...{
                handleSubmit, onSubmit, register, control, formState,watchField
            }} />
    )
}

export default MyProfileContainer