import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material"
import InputField, { SelectField } from "../../components/formField/FormFieldComponent"
import { CITIES } from "../../libs/constant";
import paperImage from "../../assets/images/paper.png"
import SmoothPopup from "../../dialog/animations/FancyAnimatedDialog";

interface MyProfileSceneProps {
    handleSubmit: (data: any) => () => void;
    onSubmit: (d: any) => void;
    register: any,
    control: any,
    formState: any,
    watchField:any
}
const MyProfileScene = (props: MyProfileSceneProps) => {
    const { handleSubmit, onSubmit, register, control, formState,watchField } = props;

    

    return (
        <SmoothPopup open={true}>
        <form id="profileform" className="profileform" onSubmit={handleSubmit(onSubmit)}>
            <Grid container component="main">
                <Grid item
                    sx={{ display: { sm: "none", md: "flex" } }}
                    xs={false}
                    md={7}>
                    <img src={paperImage} alt="paperImage" />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    justifyContent="center"
                    alignItems="center"
                    p="10px"
                >
                    <Grid><Typography variant="caption" className="d-flex justify-content-center">Profile details</Typography></Grid>
                    <form id="editProfileForm">
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    watchField,
                                    control,
                                    id: "Firstname",
                                    name: "Firstname",
                                    label: "First name"
                                }} />
                        </div>
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    id: "Lastname",
                                    name: "Lastname",
                                    label: "Last name"
                                }} />
                        </div>
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    className: "hideNumberSpin",
                                    id: "MobileNo",
                                    name: "MobileNo",
                                    label: "Phone number*",
                                    type: "number",
                                    maxLength: 10,
                                    onInput: (e) => {
                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                    }
                                }} />
                        </div>
                        <div className="input profilecity">
                            <SelectField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    id: "CityId",
                                    name: "CityId",
                                    options: CITIES,
                                    label: "Select city*",
                                    placeholder: "Select City*",
                                    isMulti: false,
                                    isClearable: false,
                                    className:"custom-select-field"
                                }}
                            />
                        </div>
                        <Box className="text-center" sx={{ mt: 2.5 }}>
                            <Button form="profileform" type="submit" variant="contained" sx={{ minWidth: "150px" }} >Save</Button>
                        </Box>

                        <Box className="text-center" sx={{ mt: 2.5 }}>
                            <Button form="profileform" type="submit" variant="contained" sx={{ minWidth: "150px" }} >Save</Button>
                        </Box>
                    </form>
                </Grid>
            </Grid >
        </form>
        </SmoothPopup>
    )
}

export default MyProfileScene