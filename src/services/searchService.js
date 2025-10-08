const { Category, Event, Actor, Images } = require('../models');
const { Op } = require('sequelize');

const searchAll = async (query, type, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const searchPattern = `%${query}%`;

  let results = {};

  if (!type || type === 'categories') {
    const categories = await Category.findAndCountAll({
      where: {
        name: {
          [Op.like]: searchPattern
        }
      },
      include: [
        {
          model: Images,
          as: 'image',
          attributes: ['id', 'filename', 'mimeType']
        }
      ],
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    results.categories = {
      data: categories.rows.map(cat => ({
        id: cat.id,
        name: cat.name,
        imageUrl: cat.imageId ? `/images/${cat.imageId}` : null,
        createdAt: cat.createdAt
      })),
      total: categories.count,
      page,
      pages: Math.ceil(categories.count / limit)
    };
  }

  if (!type || type === 'events') {
    const events = await Event.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { description: { [Op.like]: searchPattern } },
          { eventType: { [Op.like]: searchPattern } }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Images,
          as: 'image',
          attributes: ['id', 'filename', 'mimeType']
        }
      ],
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    results.events = {
      data: events.rows.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        eventType: event.eventType,
        imageUrl: event.imageId ? `/images/${event.imageId}` : null,
        category: event.category,
        createdAt: event.createdAt
      })),
      total: events.count,
      page,
      pages: Math.ceil(events.count / limit)
    };
  }

  if (!type || type === 'actors') {
    const actors = await Actor.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { shortDescription: { [Op.like]: searchPattern } },
          { city: { [Op.like]: searchPattern } },
          { language: { [Op.like]: searchPattern } },
          { genre: { [Op.like]: searchPattern } }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Images,
          as: 'profileImage',
          attributes: ['id', 'filename', 'mimeType']
        }
      ],
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    results.actors = {
      data: actors.rows.map(actor => ({
        id: actor.id,
        name: actor.name,
        shortDescription: actor.shortDescription,
        tier: actor.tier,
        eventTiming: actor.eventTiming,
        language: actor.language,
        city: actor.city,
        profileImageUrl: actor.profileImageId ? `/images/${actor.profileImageId}` : null,
        category: actor.category
      })),
      total: actors.count,
      page,
      pages: Math.ceil(actors.count / limit)
    };
  }

  return results;
};

module.exports = {
  searchAll
};
