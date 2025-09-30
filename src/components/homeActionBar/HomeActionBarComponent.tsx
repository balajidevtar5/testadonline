import { SetStateAction, useState } from "react";
import { SearchInputComponent } from "../searchInput/searchInputComponent";
import { Button, FormControlLabel, Grid, Switch } from "@mui/material";
import actionBarStyles from "./HomeActionBarStyle.module.scss";
const HomeActionBarComponent = () => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchValue(event.target.value);
    };
    const handleClearInput = () => {
        setSearchValue('');
    };
    return (
        <Grid container justifyContent="space-between" display="flex" alignItems="center">
            {/* <Grid className="p-4" lg={3} justifyContent="flex-start">
                <SearchInputComponent {...{
                    handleSearch: handleSearch,
                    handleClearInput: handleClearInput,
                    inputValue: searchValue,
                    placeholder: "Search text..."
                }} />
            </Grid> */}
            <Grid lg={12} justifyContent="flex-end" display="flex">
                <Grid className="p-4" item>
                    <Button className={actionBarStyles.addPostBtn} sx={{ color: "#252525" }}>Add Ads</Button>
                </Grid>
                <Grid className="p-4" item>
                    <Button className={actionBarStyles.addPostBtn} sx={{ color: "#252525" }}>Add Credits</Button>
                </Grid>
                <Grid className="p-4" item>
                    <Button className={actionBarStyles.addPostBtn} sx={{ color: "#252525" }}>Available Credits</Button>
                </Grid>
                <Grid className="p-4" item>
                    <FormControlLabel label="Favorites" control={<Switch defaultChecked />} sx={{pl:"10px"}}/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default HomeActionBarComponent