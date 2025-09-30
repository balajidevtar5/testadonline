import React, { useEffect, useState ,useContext } from "react";
import { DatePicker, Button, Table, message } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchstatisticsData } from "../../redux/slices/Statistics";
import { RootState } from "../../redux/reducer";
import { LoginUserState } from "../../redux/slices/auth";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";
import { LayoutContext } from '../../components/layout/LayoutContext';

const { RangePicker } = DatePicker;

interface DataRow {
  key: string;
  title: string;
  classname?: string;
  rownumber: number;
  isMainCategory?: boolean;
  [key: string]: any;
}

interface TableProps {
  className?: string;
}

const UserStatistics: React.FC<TableProps> = ({ className }) => {
  const  { isDarkMode } = useContext(LayoutContext);
  const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");
  const dispatch: any = useDispatch();
  const { data: loginUserData }: LoginUserState = useSelector(
    (state: RootState) => state.loginUser
  );
  const { isLoading, error } = useSelector(
    (state: RootState) => state.statisticsList
  );
  const [dataSource, setDataSource] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const generateDateRange = (startDate: Dayjs, endDate: Dayjs) => {
    const dates: string[] = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  };

  const generateColumns = (dates: string[]) => {
    const baseColumns = [
      {
        title: "Title",
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
    ];

    const dateColumns = dates
      .slice()
      .reverse()
      .map((date) => ({
        title: dayjs(date).format("DD-MM-YY"),
        dataIndex: date,
        key: date,
        align: "center" as const,
        render: (value: any, record: DataRow) => {
          const displayValue = value === null ? "0" : value;
          const shouldBeBold = record.classname?.includes("font-weight:600");
          
          return (
            <span className={shouldBeBold ? "font-bold" : ""}>
              {displayValue}
            </span>
          );
        },
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
      const key = item.title;
      if (!consolidatedMap.has(key)) {
        const newEntry = {
          key,
          title: item.title,
          classname: item.classname,
          rownumber: item.rownumber,
          isMainCategory: item.classname?.includes("font-weight:600"),
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

  const handleFetchData = async () => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      try {
        const response = await dispatch(fetchstatisticsData(startDate, endDate));

        if (!response || !Array.isArray(response)) {
          console.error("Invalid API response:", response);
          return;
        }

        const dates = generateDateRange(dateRange[0], dateRange[1]);
        setColumns(generateColumns(dates));
        setDataSource(transformData(response, dates));
      } catch (error) {
        console.error("Error fetching statistics data:", error);
        message.error("Failed to fetch statistics data");
      }
    }
  };

  useEffect(() => {
    if (loginUserData?.data && loginUserData?.data[0]?.roleid === 1)
      handleFetchData();
  }, [loginUserData?.data]);

  const handleReset = () => {
    setDateRange([null, null]);
    setDataSource([]);
    setColumns([]);
  };

 const disabledDate = (current: Dayjs) => {
  const today = dayjs().startOf("day");
  const maxDate = today.add(0, "days");
  return current && ( current.isAfter(maxDate, "day"));
};

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates) {
      handleReset();
      return;
    }
    setDateRange(dates);
  };

  
  

  return (
    <>
      <div className="container">
        <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
          <div className="flex align-items-center justify-between mb-4">
            <div className="d-flex align-items-center gap-8 justify-content-end">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-64"
                placeholder={["Start Date", "End Date"]}
                disabled={isLoading}
                disabledDate={disabledDate}
              />
              <Button
                type="primary"
                className="bg-blue-500 text-white h-35px"
                onClick={handleFetchData}
                loading={isLoading}
                disabled={!dateRange[0] || !dateRange[1]}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
        <div className="pb-20" style={{ marginBottom: "100px" }}> {/* Added margin to prevent overlap */}
          <Table<DataRow>
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            size="small"
            className={`mt-10 analytics-table ${className || ""}`}
            rowClassName={(record) =>
              `${record.isMainCategory ? "bg-gray-100" : ""}`
            }
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigationComponent />
        </div>
      </div>
    </>
  );
};

export default UserStatistics;