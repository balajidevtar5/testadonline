import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import { fetchRegions, fetchActivityTypes, fetchCityBasedStatistics, fetchCities, fetchDistrict } from '../../redux/slices/Statistics';
import { LoginUserState } from "../../redux/slices/auth";
import { LayoutContext } from '../../components/layout/LayoutContext';
import { TableProps, DatePicker, message, Spin, Button, Table } from 'antd';
import { SelectField } from '../../components/formField/FormFieldComponent';
import { useForm, UseFormReturn } from 'react-hook-form';
import dayjs from 'dayjs';
import { parseToHsla, hsla, readableColor } from 'color2k';
import { WidthFull } from '@mui/icons-material';
const { RangePicker } = DatePicker;

interface City {
	locationid: number;
	name: string;
}

interface FilterPayload {
	regionId: number | null;
	activityTypeId: number | null;
	viewFormat: 'daily' | 'weekly' | 'monthly' | null;
	dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
	activityId: number;
	cityIds: City[];
	SortColumn?: string;
	SortDirection?: string;
}

interface DataRow {
	key: string;
	title: string;
	classname?: string;
	rownumber: number;
	isMainCategory?: boolean;
	[key: string]: any;
}

const initialState: FilterPayload = {
	regionId: null,
	activityTypeId: null,
	viewFormat: null,
	dateRange: [null, null],
	activityId: 0,
	cityIds: [],
};

const CityBasedStatistics: React.FC = () => {
	const dispatch: any = useDispatch();
	const methods = useForm() as UseFormReturn;
	const { register, control, formState } = methods;
	const [filterPayload, setFilterPayload] = useState<FilterPayload>(initialState);
	const [dataSource, setDataSource] = useState<DataRow[]>([]);
	const [columns, setColumns] = useState<any[]>([]);
	const { isDarkMode } = React.useContext(LayoutContext);

	const { data: loginUserData }: LoginUserState = useSelector(
		(state: RootState) => state.loginUser
	);

	const { data: regions } = useSelector((state: RootState) => state.regions);
	const { data: activityTypes } = useSelector((state: RootState) => state.activityTypes);
	const { isLoading, error } = useSelector((state: RootState) => state.cityBasedStatistics);
	const [cities, setCities] = useState<City[]>([]);
	const [allDistrict, setDsitrict] = useState<City[]>([]);
	const [citiesResponseArray, setCitiesResponseArray] = useState<
	{
	  regionId: number;
	  cities: City[];
	  prevCities: { value: number; label: string }[];
	}[]
  >([]);

	useEffect(() => {
		if (loginUserData?.data && loginUserData?.data[0]?.roleid === 1) {
			dispatch(fetchRegions() as any);
			dispatch(fetchActivityTypes() as any);
		}
	}, [dispatch, loginUserData]);

	

	const handleRegionChange = async (selectedOption: any) => {
		if (selectedOption?.value) {
			const citiesResponse = await dispatch(fetchCities(selectedOption?.value) as any);

			
			if (citiesResponse) {
				const regionId = selectedOption.value;
			const alreadyExists = citiesResponseArray.some(item => item.regionId === regionId);

			if(!alreadyExists){
				setCitiesResponseArray((prev) => [
					...prev,
					{
					  regionId,
					  cities: citiesResponse,
					  prevCities: previouslySelected,
					},
				  ]);
			}

			const updatedCitiesResponseArray = citiesResponseArray.filter(
				(item) => item.regionId !== regionId
			  );
				
				const formattedCities = citiesResponse.map((city: City) => ({
					value: city.locationid,
					label: city.name
				}));

				const previouslySelected = methods.getValues('cities') || [];

				const matchedCities = formattedCities.filter((cityOption) =>
					cities.some((c) => c.locationid === cityOption.value)
				);
				const allOtherCityIds = updatedCitiesResponseArray.flatMap((item) =>
					item.cities.map((c) => c.locationid)
				  );

				  const filteredPreviouslySelected = previouslySelected.filter(
					(city) => !allOtherCityIds.includes(city.value)
				  );

				const combinedSelection = [
					...filteredPreviouslySelected,
					...matchedCities.filter(
						(matched) => !previouslySelected.some((prev) => prev.value === matched.value)
					),
				];

				// Step 6: Set final combined selection in the form
				methods.setValue('cities', combinedSelection);

				// Step 7: Update payload
				setFilterPayload((prev) => ({
					...prev,
					cityIds: citiesResponse,
					regionId: selectedOption.value,
				}));
			}
		} else {
			// setCities([]);
			setFilterPayload(prev => ({
				...prev,
				cityIds: [],
				regionId: null
			}));
			methods.setValue('cities', []);
		}
	};


	
	const handleActivityTypeChange = (selectedOption: any) => {
		setFilterPayload(prev => ({
			...prev,
			activityTypeId: selectedOption?.value || null
		}));
	};


	const handleDateRangeChange = (dates: any) => {
		if (!dates || dates.length < 2) {
			setFilterPayload(prev => ({
				...prev,
				dateRange: [null, null]
			}));
			return;
		}

		const [startDate, endDate] = dates;
		setFilterPayload(prev => ({
			...prev,
			dateRange: [startDate.startOf('day'), endDate.endOf('day')]
		}));
	};

	const handleViewFormatChange = (selectedOption: any) => {
		setFilterPayload(prev => ({
			...prev,
			viewFormat: selectedOption?.value || null
		}));
	};

	const handleCityChange = (selectedOptions: any) => {
		setFilterPayload(prev => ({
			...prev,
			cityIds: selectedOptions?.length ? selectedOptions.map((opt: any) => ({
				locationid: opt.value,
				name: opt.label
			})) : []
		}));
	};

	const regionsOptions = regions?.map((region: any) => ({
		value: region.id,
		label: region.name
	})) || [];

	const activityTypesOptions = activityTypes?.map((type: any) => ({
		value: type.id,
		label: type.name
	})) || [];

	const viewFormatOptions = [
		{ value: 'daily', label: 'Daily Format' },
		{ value: 'weekly', label: 'Weekly Format' },
		{ value: 'monthly', label: 'Monthly Format' }
	];

	const citiesOptions = [
		{ label: "Select All", value: "__all__" },
		...cities.map((city: City) => ({
		  value: city.locationid,
		  label: city.name,
		})),
	  ];

	const generateDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
		const dates: string[] = [];
		let currentDate = startDate;

		while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
			dates.push(currentDate.format("YYYY-MM-DD"));
			currentDate = currentDate.add(1, "day");
		}
		return dates;
	};

	

	const getHeatmapColor = (value: number, min: number, max: number) => {
		const baseColor = "#AFE1AF"; // Base green
	
		try {
			const [h, s, l, a] = parseToHsla(baseColor);
	
			if (min === max) {
				const fallbackColor = hsla(h, s, 0.7, a);
				return {
					backgroundColor: fallbackColor,
					textColor: l < 0.5 ? "#fff" : "#000" // Fallback based on lightness
				};
			}
	
			let percent = (value - min) / (max - min);
			percent = Math.max(0, Math.min(1, percent));
	
			// Apply square root scaling
			const adjustedPercent = Math.sqrt(percent);
	
			const maxLightness = 0.97;
			const minLightness = 0.4;
			const lightness = maxLightness - ((maxLightness - minLightness) * adjustedPercent);
	
			const backgroundColor = hsla(h, s, lightness, a);
	
			// Manually decide text color based on final background lightness
			const textColor = lightness < 0.5 ? "#fff" : "#000";
	
			return { backgroundColor, textColor };
		} catch (err) {
			console.error("Heatmap error:", err);
			return { backgroundColor: "#ccc", textColor: "#000" };
		}
	};
	
	
	
	const generateColumns = (dates: string[],transformed) => {

		const allValues = transformed.flatMap(row => {
			const numericValues = [
			  ...(row.total !== undefined ? [Number(row.total) || 0] : []),
			  ...dates.map(date => Number(row[date]) || 0)
			];
			return numericValues.filter(val => !isNaN(val));
		  });
		  
		  const globalMin = Math.min(...allValues);
		  const globalMax = Math.max(...allValues);

		const baseColumns = [
			{
				title: "City Name",
				dataIndex: "title",
				key: "title",
				fixed: "left",
				ellipsis: false,
				render: (text: string, record: DataRow) => (
					<span
						className={`pl-1 md:whitespace-nowrap whitespace-normal break-words
              ${record.classname || ""} ${record.classname?.includes("font-weight:600") ? "font-bold" : ""}`}
					>
						{text}
					</span>
				),
			},

			{
				title: "Displayname",
				dataIndex: "displayname",
				key: "displayname",
				align: "center" as const,
				ellipsis: false,

				render: (text: string, record: DataRow) => (

					<span
						className={`pl-1 md:whitespace-nowrap whitespace-normal break-words
	  ${record.classname || ""} ${record.classname?.includes("font-weight:600") ? "font-bold" : ""}`}
					>
						{text}
					</span>
				),
			},

			{
				title: "Total",
				dataIndex: "total",
				key: "total",
				align: "center" as const,
				onCell: (record) => {
				  const displayValue = record.total === null || record.total === 0  ? null : Number(record.total) || 0;
				  const { backgroundColor, textColor } = getHeatmapColor(
					displayValue,
					globalMin, // Use global min/max
					globalMax
				  );
				  return {
					style: { backgroundColor, color: textColor },
					className: record.classname?.includes("font-weight:600") ? "font-bold" : "",
				  };
				},
				render: (text: string) => text,
			  },
		];

		const dateColumns = dates.slice().reverse().map((date) => ({
			title: dayjs(date).format("DD-MM-YY"),
			dataIndex: date,
			key: date,
			align: "center" as const,
			sorter: true,
			onCell: (record) => {
			  const displayValue = record[date] === null || record[date] === 0  ? null : Number(record[date]) || 0;
			  const { backgroundColor, textColor } = getHeatmapColor(
				displayValue,
				globalMin, // Use global min/max
				globalMax
			  );
			  return {
				style: { backgroundColor, color: textColor },
				className: record.classname?.includes("font-weight:600") ? "font-bold" : "",
			  };
			},
			render: (value: any) => value === null || value === 0   ? null : Number(value) || 0,
		  }));

	return [...baseColumns, ...dateColumns];
};

	const transformData = (apiData: any[], dates: string[]) => {
		if (!apiData || !Array.isArray(apiData)) {
			console.error("transformData received invalid data:", apiData);
			return [];
		}
		const consolidatedMap = new Map();
		apiData.forEach((item) => {
			const key = item.cityname;
			if (!consolidatedMap.has(key)) {
				const newEntry = {
					key,
					title: item.cityname,
					classname: item.classname,
					rownumber: item.rownumber,
					isMainCategory: item.classname?.includes("font-weight:600"),
					total: item.total || 0,
					displayname: item.displayname
				};
				dates.forEach((date) => {
					newEntry[date] = null;
				});
				consolidatedMap.set(key, newEntry);
			}
			dates.forEach((date) => {
				if (item[date] !== undefined) {
					consolidatedMap.get(key)[date] = item[date];
				}
			});
		});
		return Array.from(consolidatedMap.values()).sort(
			(a, b) => a.rownumber - b.rownumber
		);
	};

	useEffect(() => {
    if (filterPayload.dateRange[0] && filterPayload.dateRange[1]) {
        handleFetchData();
    }
}, [filterPayload.SortColumn, filterPayload.SortDirection]);

	const handleTableChange = ( pagination, filters, sorter, extra) => {
		const updatedPayload = {
        ...filterPayload,
        SortColumn: "",
        SortDirection: "",
    };

    if (sorter && sorter.field) {
        updatedPayload.SortColumn = sorter.field;
        updatedPayload.SortDirection = sorter.order === "descend" ? "desc" : "asc";
    } else {
        
        updatedPayload.SortColumn = "";
        updatedPayload.SortDirection = "";
    }

    setFilterPayload(updatedPayload);
	};

	const generatePayload = () => {
		const { activityTypeId, cityIds, viewFormat, dateRange, SortColumn, SortDirection } = filterPayload;
		const selectCityIds = methods.getValues('cities') || [];
		return {
			activityId: activityTypeId || 0,
			cityIds: selectCityIds.length > 0 ? selectCityIds.map(city => city?.value).join(",") : "",
			viewFormat: viewFormat || "",
			startDate: dayjs(dateRange[0]).format('YYYY-MM-DD'),
			endDate: dayjs(dateRange[1]).format('YYYY-MM-DD'),
			SortColumn: SortColumn ,
			SortDirection: SortDirection ,
		};
	};
	const handleFetchData = async () => {
		if (filterPayload.dateRange[0] && filterPayload.dateRange[1]) {
			try {
				const payload = generatePayload();

				const response = await dispatch(fetchCityBasedStatistics(payload));
				if (!response || !Array.isArray(response)) {
					console.error("Invalid API response:", response);
					return;
				}
				const knownKeys = ["cityname", "classname", "displayname", "displayorder"];
				const dynamicDatesSet = new Set<string>();

				response.forEach((item) => {
					Object.keys(item).forEach((key) => {
						if (!knownKeys.includes(key) && dayjs(key, 'YYYY-MM-DD', true).isValid()) {
							dynamicDatesSet.add(key);
						}
					});
				});
               
				if (response) {
					const dates = Array.from(dynamicDatesSet).sort();
					const transformed = transformData(response, dates);
					setDataSource(transformed);
					setColumns(generateColumns(dates, transformed)); // pass it directly
				  }
			

			} catch (error) {
				console.error('Error fetching data:', error);
				message.error(error.message);
				setDataSource(transformData([], []));


			}
		}
	};


	const fetchDistrictData = async () => {
		try {
			const response = await dispatch(fetchDistrict());
			if (response) {
				setCities(response)
				setFilterPayload(prev => ({
					...prev,
					cityIds: response,
				}));
			}
		} catch (error) {

		}
	}
	useEffect(() => {
		if (loginUserData?.data && loginUserData?.data[0]?.roleid === 1)
			handleFetchData();
	}, [loginUserData?.data]);

	useEffect(() => {
		fetchDistrictData();
	}, [])
	return (
		<div className="d-flex flex-column p-10">
			<div className="d-flex justify-content-between align-items-center">
				<div className="d-flex flex-wrap justify-content-start gap p-10 pb-0 mb-60">
					<div className="w-64">
						<SelectField
							{...{
								register,
								formState,
								control,
								id: "region",
								name: "region",
								isSearchable: false,
								styles: {
									control: (base) => ({
										...base,
										border: '1px solid #d9d9d9',
										boxShadow: 'none',
									}),
									singleValue: (base) => ({
										...base,
										color: isDarkMode ? '#e2e8f0' : '#333', // match your theme
									}),
								},
								className: isDarkMode ? 'react-select dark' : 'react-select',
							}}
							placeholder="Select Region"
							options={regionsOptions}
							onSelectChange={handleRegionChange}
							isClearable={true}
							isMulti={false}
						/>
					</div>
					<div className="w-64">
						<SelectField
							{...{
								register,
								formState,
								control,
								id: "cities",
								name: "cities",
								classNamePrefix: "city-select",
								isSearchable: true,
								isDisabled: !filterPayload.regionId,
								styles: {
									control: (base, state) => ({
										...base,
										boxShadow: 'none',
										backgroundColor: isDarkMode ? '#1F1F1F' : 'white',
										borderColor: isDarkMode ? '#404040' : 'hsl(0, 0%, 86.27%)',
										outline: 'none',
										'&:hover': {
											borderColor: isDarkMode ? "#404040S" : base.borderColor,
										},
										//color: isDarkMode ? '#e2e8f0' : 'inherit',
									}),
									menu: (base) => ({
										...base,
										width: '100%',
										minWidth: '100%',
										zIndex: 9999,
										backgroundColor: isDarkMode ? '#1F1F1F' : 'white',
									}),
									menuPortal: (base) => ({
										...base,
										zIndex: 9999, 
									}),
									menuList: (base) => ({
										...base,
										minWidth: methods.getValues('cities')?.length > 0 ? "200px" : '200px',
										width: '100%',
										maxHeight: '300px',
										overflowY: 'scroll',
										boxSizing: 'border-box',
										whiteSpace: 'nowrap',
										scrollbarWidth: 'thin',
										msOverflowStyle: 'auto',
										backgroundColor: isDarkMode ? '#1F1F1F' : 'white',
										color: isDarkMode ? '#1F1F1F' : 'inherit',
									}),
									option: (base, state) => ({
										...base,
										color: isDarkMode ? '#1F1F1F' : 'inherit',
									}),
								},
								menuPortalTarget: document.body,
								className: isDarkMode ? 'react-select dark' : 'react-select',
							}}
							placeholder="Select Cities"
							options={citiesOptions}
							onSelectChange={handleCityChange}
							isMulti={true}
							isClearable={true}
							value={filterPayload.cityIds.map(city => ({
								value: city.locationid,
								label: city.name
							}))}
							formatValueContainer={(selected: any[]) =>
								selected?.length > 0 ? `${selected.length} Cities Selected` : ''
							}
						/>
					</div>
					<div className="w-64">
						<SelectField
							{...{
								register,
								formState,
								control,
								id: "activityType",
								name: "activityType",
								isSearchable: false,
								isDisabled: !filterPayload.regionId,
								styles: {
									control: (base) => ({
										...base,
										border: '1px solid #d9d9d9',
										boxShadow: 'none',
									}),
								},
							}}
							placeholder="Select Activity Type"
							options={activityTypesOptions}
							onSelectChange={handleActivityTypeChange}
							isClearable={true}
							isMulti={false}
						/>
					</div>
					<div className="w-64">
						<SelectField
							{...{
								register,
								formState,
								control,
								id: "viewFormat",
								name: "viewFormat",
								isSearchable: false,
								styles: {
									control: (base) => ({
										...base,
										border: '1px solid #d9d9d9',
										boxShadow: 'none',
									}),
								},
							}}
							placeholder="Select View Format"
							options={viewFormatOptions}
							onSelectChange={handleViewFormatChange}
							isClearable={false}
							isMulti={false}
						/>
					</div>
					<RangePicker
						className={`w-50 ant-picker ${isDarkMode ? 'dark' : ''}`}
						dropdownClassName={`ant-picker ${isDarkMode ? 'dark' : ''}`}
						onChange={handleDateRangeChange}
						format="DD/MM/YYYY"
						allowClear={true}
						value={
							filterPayload.dateRange[0] && filterPayload.dateRange[1]
								? filterPayload.dateRange
								: [null, null]
						}
						ranges={
							filterPayload.viewFormat === 'daily'
								? {
									// Today: [dayjs(), dayjs()],
									Yesterday: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
									'Last 7 Days': [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day'),],
									'Last 30 Days': [dayjs().subtract(30, 'day'),  dayjs().subtract(1, 'day'),],
									'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
									'Last Month': [
										dayjs().subtract(1, 'month').startOf('month'),
										dayjs().subtract(1, 'month').endOf('month'),
									],
								}
								: filterPayload.viewFormat === 'weekly'
									? {
										'Last 7 Days': [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day'),],
									}
									: {
										'Last 30 Days': [dayjs().subtract(30, 'day'),  dayjs().subtract(1, 'day'),],
										'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
										'Last Month': [
											dayjs().subtract(1, 'month').startOf('month'),
											dayjs().subtract(1, 'month').endOf('month'),
										],
									}
						}
					/>

					<Button
						type="primary"
						className="bg-blue-500 text-white h-38px mt-2 align-items-center"
						onClick={handleFetchData}
						loading={isLoading}
						disabled={
							!filterPayload.activityTypeId ||
							!filterPayload.viewFormat ||
							!filterPayload.dateRange[0] ||
							!filterPayload.dateRange[1] ||
							filterPayload.cityIds.length === 0
						}
					>
						Apply Filter
					</Button>
				</div>
			</div>
			{/*{filterPayload.regionId && (
				<div className="d-flex p-10 gap flex-wrap justify-content-start">
					{countryOptions.map((country, index) => (
						<Chip 
							key={index}
							label={country}
							className="bg-blue-100 text-blue-600 font-medium px-3 py-1 rounded-full hover:bg-blue-200"
							onDelete={() => console.log("Chip deleted")}
						/>
					))}
				</div>
			)}*/}
			<div className="pb-20" style={{ marginBottom: "100px" }}>
				<Table<DataRow>
					loading={isLoading}
					columns={columns}
					dataSource={dataSource}
					pagination={false}
					bordered
					size="small"
					className={`mt-10 analytics-table`}
					rowClassName={(record) =>
						`${record.isMainCategory ? "bg-gray-100" : ""}`
					}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
}
export default CityBasedStatistics;