const Btn = ({ click, icon }) => {
    return (
        <button onClick={click} className="btn p-2">
            {icon}
        </button>
    );
};

export default Btn;
