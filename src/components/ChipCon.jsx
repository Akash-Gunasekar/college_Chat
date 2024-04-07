
const ChipCon = ({value,setAction,data}) => {

  return (
    <div className={`d-flex align-items-center gap-2 flex-wrap chip-section mt-4 `}>
                            {value.map((item, idx) => {
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`rounde-lg fs-regular grey-text ${item===data?"active":""}`}
                                  onClick={()=>setAction(item)}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
  )
}

export default ChipCon