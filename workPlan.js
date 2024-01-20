const rangeData = {
  total: 0,
  values: {
    btc: 0,
    etc: 0,
    ltc: 0,
    doge: 0,
  },
  maximums: {
    btc: 0,
    etc: 0,
    ltc: 0,
    doge: 0,
  },
  setTotal(param) {
    param = +param
    this.total = param
    for(const propName in rangeData.maximums) {
      this.maximums[propName] = param
      this.values[propName] = 0
    }
  },
  setValue(propName, value) {
    value = +value
    this.values[propName] = value

    if(value > this.maximums[propName]) {
      this.values[propName] = this.maximums[propName]
    }
    if(value < 0) {
      this.values[propName] = 0
    }
    this.updateMaximums(propName)
    this.calcCoinQuantity(propName)
  },


   async calcCoinQuantity(propName, value) {
    let result
    let awaitCoin = await getData(propName)
    result = this.values[propName] / awaitCoin  
    console.log(awaitCoin)
    return result
   },


  plusOne(propName) {
    const value = this.values[propName] + 1
    this.setValue(propName, value)
  },
  minusOne(propName) {
    const value = this.values[propName] - 1
    this.setValue(propName, value)
  },
  calcSumValues() {
    let sumValues = 0
    for(const keys in this.values) {
      sumValues += this.values[keys]
    }
    // console.log(typeof +sumValues)
    return +sumValues
  },
  updateMaximums(otherCoin) {
    for (const key in this.maximums) {
      if (key !== otherCoin) {
        this.maximums[key] = this.total - this.calcSumValues() + this.values[key]
        // console.log(this.values[key])
      }
    }
  }
  
}

// const domRangeData = {

// }


// rangeData.setTotal(10)
// rangeData.plusOne('btc')


// rangeData.setValue('btc',  13)
// rangeData.setValue('ltc',  7)
// rangeData.setValue('etc',  13)

// rangeData
// rangeData.changeTotal('btc')
// rangeData

// rangeData.setTotal(10)
// rangeData.setValue('left', 9)
// rangeData.changeValue('left', 'right', 1) 
// console.log(rangeData)
// rangeData
// rangeData.setTotal(10)
// console.log(rangeData.values);
// console.log(rangeData.maximums);
// rangeData.setValue('left', 5)
// console.log(rangeData.values);
// console.log(rangeData.maximums);
// rangeData.setValue('left', -15)
// console.log(rangeData.values);
// console.log(rangeData.maximums);
