const { addAvailableCity } = require('./addAvailableCity');
const { addBarbershop } = require('./addBarbershop');
const { addBarbershopExample } = require('./addBarbershopExample');
const { addMultipleBarbershopExample } = require('./addMultipleBarbershopExample');
const { addServices } = require('./addServices');
const { getBarbershopById } = require('./getBarbershopById');
const { getBarbershops } = require('./getBarbershops');
const { setBarbershopAvailability } = require('./setBarbershopAvailability');
const { setBarbershopSchedule } = require('./setBarbershopSchedule')
const { updateAddress } = require('./updateAddress')
const { updateHomeServiceStatus } = require('./updateHomeServiceStatus')
const { updateOrderData } = require('./updateOrderData')


module.exports = {
    addAvailableCity,
    addBarbershop,
    addBarbershopExample,
    addMultipleBarbershopExample,
    addServices,
    getBarbershopById,
    getBarbershops,
    setBarbershopAvailability,
    setBarbershopSchedule,
    updateAddress,
    updateHomeServiceStatus,
    updateOrderData,
};
