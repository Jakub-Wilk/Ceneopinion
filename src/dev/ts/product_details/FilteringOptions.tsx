import { useState } from "react";
import { FaCheckSquare, FaFilter, FaSquare, FaWindowClose } from "react-icons/fa";
import { Data, Filters } from "../product_details";
import DateRangePicker, { DateRangePickerProps } from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Stars from "./Stars";

interface FilteringOptionsProps {
    data: Data
}

function FilteringOptions(props: FilteringOptionsProps) {
    const [isVisible, setVisible] = useState(true);

    const toggleVisible = () => {
        setVisible(!isVisible);
    };

    const time_posted = {
        "max": new Date(props.data.filter_data["Time Posted"].max),
        "min": new Date(props.data.filter_data["Time Posted"].min)
    };

    const time_bought = {
        "max": new Date(props.data.filter_data["Time Bought"].max),
        "min": new Date(props.data.filter_data["Time Bought"].min)
    };

    const filter_bounds: Filters = {
        "Recommended": {true: true, false: true},
        "Trusted": {true: true, false: true},
        "Stars": props.data.filter_data["Stars"],
        "Time Posted": time_posted,
        "Time Bought": time_bought,
        "Upvotes": props.data.filter_data["Upvotes"],
        "Downvotes": props.data.filter_data["Downvotes"]
    };
    
    const [recommendedState, setRecommendedState] = useState(filter_bounds["Recommended"]);
    const [trustedState, setTrustedState] = useState(filter_bounds["Trusted"]);
    const [timePostedRange, setTimePostedRange] = useState<DateRangePickerProps["value"]>([filter_bounds["Time Posted"].min, filter_bounds["Time Posted"].max]);
    const [timeBoughtRange, setTimeBoughtRange] = useState<DateRangePickerProps["value"]>([filter_bounds["Time Bought"].min, filter_bounds["Time Bought"].max]);
    const [starsRange, setStarsRange] = useState([filter_bounds["Stars"].min, filter_bounds["Stars"].max]);
    const [upvotesRange, setUpvotesRange] = useState([filter_bounds["Upvotes"].min, filter_bounds["Upvotes"].max]);
    const [downvotesRange, setDownvotesRange] = useState([filter_bounds["Downvotes"].min, filter_bounds["Downvotes"].max]);

    const apply_filters = () => {
        const filters: Filters = {
            "Recommended": recommendedState,
            "Trusted": trustedState,
            "Stars": {
                min: starsRange[0],
                max: starsRange[1]
            },
            "Time Posted": {
                min: timePostedRange as Date[][0],
                max: timePostedRange as Date[][1]
            },
            "Time Bought": {
                min: timeBoughtRange as Date[][0],
                max: timeBoughtRange as Date[][1]
            },
            "Upvotes": {
                min: upvotesRange[0],
                max: upvotesRange[1]
            },
            "Downvotes": {
                min: downvotesRange[0],
                max: downvotesRange[1]
            }
        };

        const payload = btoa(encodeURIComponent(JSON.stringify(filters)));
        const urlparams = new URLSearchParams(location.search);
        urlparams.set("filters", payload);
        location.search = urlparams.toString();
    };

    return <div className={`filter ${isVisible ? "filter-visible" : "filter-hidden"}`}>
        <div className="h-full w-full border border-ceneo border-l-0 bg-white rounded-r-lg flex flex-col">
            <div className="w-full flex justify-end p-1"><FaWindowClose color="#FF6400" className="w-6 h-6 relative cursor-pointer" onClick={toggleVisible}/></div>
            <div className="flex flex-col items-center">
                <div className="check-list">
                    <div>Poleca:</div>
                    <div className="check" onClick={() => setRecommendedState({true: !recommendedState.true, false: recommendedState.false})}>
                        {recommendedState.true ? <FaCheckSquare /> : <FaSquare />}
                        <span>Tak</span>
                    </div>
                    <div className="check" onClick={() => setRecommendedState({true: recommendedState.true, false: !recommendedState.false})}>
                        {recommendedState.false ? <FaCheckSquare /> : <FaSquare />}
                        <span>Nie</span>
                    </div>
                </div>
                <div className="check-list">
                    <div className="filter-label">Zaufana:</div>
                    <div className="check" onClick={() => setTrustedState({true: !trustedState.true, false: trustedState.false})}>
                        {trustedState.true ? <FaCheckSquare /> : <FaSquare />}
                        <span>Tak</span>
                    </div>
                    <div className="check" onClick={() => setTrustedState({true: trustedState.true, false: !trustedState.false})}>
                        {trustedState.false ? <FaCheckSquare /> : <FaSquare />}
                        <span>Nie</span>
                    </div>
                </div>
                <div className="filter-label">Gwiazdki:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={starsRange}
                        onChange={value => setStarsRange(value as number[])}
                        min={filter_bounds["Stars"].min}
                        max={filter_bounds["Stars"].max}
                        step={0.5}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <Stars count={starsRange[0]}/>
                    <span>-</span>
                    <Stars count={starsRange[1]}/>
                </div>
                <div className="filter-label">Czas recenzji:</div>
                <DateRangePicker
                    onChange={setTimePostedRange}
                    value={timePostedRange}
                    minDate={filter_bounds["Time Posted"].min}
                    maxDate={filter_bounds["Time Posted"].max}
                    closeCalendar={false}
                />
                <div className="filter-label">Czas kupna:</div>
                <DateRangePicker
                    onChange={setTimeBoughtRange}
                    value={timeBoughtRange}
                    minDate={filter_bounds["Time Bought"].min}
                    maxDate={filter_bounds["Time Bought"].max}
                    closeCalendar={false}
                />
                <div className="filter-label">Głosy +:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={upvotesRange}
                        onChange={value => setUpvotesRange(value as number[])}
                        min={filter_bounds["Upvotes"].min}
                        max={filter_bounds["Upvotes"].max}
                        step={1}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <span>{upvotesRange[0]}</span>
                    <span>-</span>
                    <span>{upvotesRange[1]}</span>
                </div>
                <div className="filter-label">Głosy -:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={downvotesRange}
                        onChange={value => setDownvotesRange(value as number[])}
                        min={filter_bounds["Downvotes"].min}
                        max={filter_bounds["Downvotes"].max}
                        step={1}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <span>{downvotesRange[0]}</span>
                    <span>-</span>
                    <span>{downvotesRange[1]}</span>
                </div>
                <div
                    className="bg-ceneo w-3/5 h-10 rounded mt-10 grid place-content-center text-white text-xl cursor-pointer hover:bg-orange-500 select-none transition"
                    onClick={apply_filters}
                >
                    Aplikuj filtry
                </div>
            </div>
        </div>
        <FaFilter className={`filter-button ${isVisible ? "filter-button-hidden" : "filter-button-visible"}`} onClick={toggleVisible}/>
    </div>;
}

export default FilteringOptions;