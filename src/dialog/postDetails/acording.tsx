import { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  ListItemText,
  Collapse,
  List,
  ListItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { API_ENDPOINT_PROFILE } from '../../libs/constant';
import { useTranslation } from 'react-i18next';

const AccordionComponent = (props) => {
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openOptions, setOpenOptions] = useState(null);
  const { categoryList, handleOk, selectedSubcategory,setCategoryClick,categoryClick } = props;
  const { t } = useTranslation();

  useEffect(() => {
    const parsedData = categoryList?.data?.map((category) => ({
      ...category,
      subcategory: category.subcategory ? JSON.parse(category.subcategory) : [],
    }));
    setCategories(parsedData);
  }, [categoryList?.data]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenOptions(null);
  };

  const toggleSubOptions = (category) => {
    
    // If no subcategories are present, select the main category directly
    if (!category.subcategory.length) {
      handleSelectAll(category);
      setCategoryClick(true)
      handleClose();
    } else {
      setOpenOptions((prev) => (prev === category.displayname ? null : category.displayname));
    }
  };

  const handleSelectAll = (category) => {
    handleOk({ Name: category.displayname, Icon: category.icon }, category);
    handleClose();
  };

  const handleSubcategorySelect = (subcategory, category) => {
    handleOk(subcategory, category);
    setCategoryClick(false)
    handleClose();
  };

  const open = Boolean(anchorEl);


  
  

  return (
    <> 
      <div className='category-list'
        onClick={handleClick}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
        }}
      >
        <span className="d-flex align-items-center">
          {selectedSubcategory && (
            categoryClick ? (
              <img
                src={selectedSubcategory?.Icon}
                alt={selectedSubcategory.Name}
                style={{ marginRight: '8px', maxHeight: '30px' }}
              />
            ) : (
              <img
                src={`${API_ENDPOINT_PROFILE}/SubCategoryIcon/${selectedSubcategory?.Icon}`}
                alt={""}
                style={{ marginRight: '8px', maxHeight: '30px' }}
              />
            )
          )}
          {selectedSubcategory ? selectedSubcategory.Name :<span style={{color:"#9c9191"}}> {t("General.Select category*")}</span>}
        </span>
        <span
          className="d-flex"
          style={{ borderLeft: '1px solid #cccccc', paddingLeft: '4px' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </span>
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ width: '150%' }}
        MenuListProps={{
          className: 'according',
        }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <MenuItem
              onClick={() => toggleSubOptions(category)}
              className={openOptions === category.displayname && 'Mui-focusVisible'}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <img src={category.icon} className="mr-10 wd-30px h-auto" alt="Category icon" />
              <ListItemText primary={category.displayname} />
              {category.subcategory.length > 0 && (
                openOptions === category.displayname ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )
              )}
            </MenuItem>
            <Collapse
              in={openOptions === category.displayname && category.subcategory.length > 0}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {category.subcategory.map((subcategory) => (
             <ListItem
             key={subcategory.SubCategoryId}
             onClick={() => handleSubcategorySelect(subcategory, category)}
            //  selected={selectedSubcategory?.Name && selectedSubcategory?.Name === subcategory.Name}
           >
             <img
               src={`${API_ENDPOINT_PROFILE}/SubCategoryIcon/${subcategory?.Icon}`}
               className="mr-10 wd-30px"
               style={{ maxHeight: '30px' }}
               alt="Subcategory icon"
             />
             <ListItemText primary={subcategory.Name} />
           </ListItem>
           
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </Menu>
    </>
  );
};

export default AccordionComponent;
