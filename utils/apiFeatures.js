class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const extractedFields = ['page', 'sort', 'limit', 'fields'];
    extractedFields.forEach((el) => delete queryObj[el]);

    //1B)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryString);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // to sort by multiple field...
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    //3)Field Selecting (projecting)

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // example req.select('name duration price');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // exclude this property from the result
    }
    return this;
  }
  paginate() {
    // 4) PAGINATION

    const page = this.queryString.page * 1 || 1; //multiply by 1 to convert it in int
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    //  if (this.queryString.page) {
    //    const numTour = await Tour.countDocuments();
    //    if (skip >= numTour) throw new Error('This page does not exist');
    //  }
    return this;
  }
}
module.exports = APIFeatures;
