import mongoose from "mongoose";

interface IPageQueryResult<T>{
    itemList:T[]
    total:number
    isEnd:boolean
}
const pageQuery = <T=any>(Model:mongoose.Model<T>)=>async (pageIndex:number,pageSize:number) =>{
    const itemListPromise = Model.find().skip(pageIndex*pageSize).limit(pageSize).exec()
    const totalPromise = Model.countDocuments().exec()
    const [itemList,total] = await Promise.all([itemListPromise,totalPromise])
    const isEnd = (pageIndex+1)*pageSize>=total
    const result:IPageQueryResult<T>={
        itemList,
        total,
        isEnd
    }
return result
}

export default pageQuery