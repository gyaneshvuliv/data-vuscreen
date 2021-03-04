'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
// var db_pp = require('../../config/mysql_pp')
var Action = require('../vuscreen/vuscreen.model');
var moment = require('moment');
var EM = require('../../../server/config/email-dispatcher');
var NodeCache = require("node-cache");
var cachedData = new NodeCache({ stdTTL: 0 });
var mongoose = require('mongoose')
var json2csv = require('json2csv');
var fs = require('fs')
var config = require('../../../server/config/environment');
var request = require('request');
var cronController = require('../cron/cron.controller');
var async = require('async');



// wifi_login_count()
// vuscreen_analyticsSMS();








////////  visualize analytics by  tushar mehta  //////////////////////////////////////////

exports.vuscreen_analyticsvu_panl = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }



  async.parallel([
    function (callback) {
      var query = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1)as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          callback(null, Watch);
        }
      })
    },
    function (callback) {
      var query1 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query1, function (err, pdf) {
         if (err) {
          callback(err, null);
        }
        else {
          callback(null, pdf);
        }
      })
    },function (callback) {
      var query2 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query2, function (err, audio) {
             if (err) {
          callback(err, null);
        }
        else {
          callback(null, audio);
        }
      })
    },function (callback) {
      var query3 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query3, function (err, travel) {
                if (err) {
          callback(err, null);
        }
        else {
          callback(null, travel);
        }
      })
    },function (callback) {
      var query4 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query4, function (err, store) {
        if (err) {
          callback(err, null);
        }
        else {
          callback(null, store);
        }
      })
    },function (callback) {
      var query5 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query5, function (err, fnb) {
                         if (err) {
          callback(err, null);
        }
        else {
          callback(null, fnb);
        }
      })
    },function (callback) {
      var query6 = "SELECT b.id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.type  like '%ad%'  and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title"
      db.get().query(query6, function (err, ad) {
                                              if (err) {
          callback(err, null);
        }
        else {
          callback(null, ad);
        }
      })
    },function (callback) {
      var query7 = "SELECT count(1) as clicks, count(distinct mac) as users, menu FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu"
     db.get().query(query7, function (err, menu) {
                       if (err) {
          callback(err, null);
        }
        else {
          callback(null, menu);
        }
      })
    },  
  ],
    function (err, results) {

      console.log(results.length);
      var finalData = {
                                          WATCH: results[0],
                                          PDF: results[1],
                                          AUDIO: results[2],
                                          TRAVEL: results[3],
                                          STORE: results[4],
                                          FNB: results[5],
                                          AD: results[6],
                                          MENU: results[7]
                                        }

      return res.status(200).json(finalData);
     
    });



 
}
// vuscreen_analyticsvu_panl();
exports.vuscreen_analyticsvu_panlpro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  // var hostss = " ('1', '2', '3', '4', '5', '6', '8', '10', '11', '13', '14', '15', '17', '18', '20', '22', '23', '26', '29', '32', '33', '35', '36', '37', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '78', '79', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '106', '107', '108', '110', '111', '112', '113', '114', '115', '116', '117', '118', '123', '124', '125', '127', '128', '130', '132', '134', '142', '146', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '163', '164', '169', '171', '172', '173', '174', '175', '177', '180', '181', '184', '185', '186', '188', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '203', '205', '206', '207', '208', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '301', '302', '303', '304', '305', '306')"

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      async.parallel([
        function (callback) {
          var query = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query, function (err, Watch) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, Watch);
            }
          })
        },
        function (callback) {
          var query1 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query1, function (err, pdf) {
             if (err) {
              callback(err, null);
            }
            else {
              callback(null, pdf);
            }
          })
        },function (callback) {
          var query2 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
              db.get().query(query2, function (err, audio) {
                 if (err) {
              callback(err, null);
            }
            else {
              callback(null, audio);
            }
          })
        },function (callback) {
          var query3 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
                  db.get().query(query3, function (err, travel) {
                    if (err) {
              callback(err, null);
            }
            else {
              callback(null, travel);
            }
          })
        },function (callback) {
          var query4 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query4, function (err, store) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, store);
            }
          })
        },function (callback) {
          var query5 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
                          db.get().query(query5, function (err, fnb) {
                             if (err) {
              callback(err, null);
            }
            else {
              callback(null, fnb);
            }
          })
        },function (callback) {
          var query6 = "SELECT b.id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.type  like '%ad%'  and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title";
                              db.get().query(query6, function (err, ad) {
                                                  if (err) {
              callback(err, null);
            }
            else {
              callback(null, ad);
            }
          })
        },function (callback) {
          var query7 = "SELECT Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks, menu FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu"
          db.get().query(query7, function (err, menu) {
                           if (err) {
              callback(err, null);
            }
            else {
              callback(null, menu);
            }
          })
        },
      ],
        function (err, results) {

          console.log(results.length);
          var finalData = {
                                              WATCH: results[0],
                                              PDF: results[1],
                                              AUDIO: results[2],
                                              TRAVEL: results[3],
                                              STORE: results[4],
                                              FNB: results[5],
                                              AD: results[6],
                                              MENU: results[7]
                                            }

          return res.status(200).json(finalData);
         
        });

    
    }
  })
}
// vuscreen_analyticsvu_panlpro();
exports.vuscreen_analyticsvu_des = function (req, res) {
  console.log("vishall");
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  //var hostss = " ('1', '2', '3', '4', '5', '6', '8', '10', '11', '13', '14', '15', '17', '18', '20', '22', '23', '26', '29', '32', '33', '35', '36', '37', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '78', '79', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '106', '107', '108', '110', '111', '112', '113', '114', '115', '116', '117', '118', '123', '124', '125', '127', '128', '130', '132', '134', '142', '146', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '163', '164', '169', '171', '172', '173', '174', '175', '177', '180', '181', '184', '185', '186', '188', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '203', '205', '206', '207', '208', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '301', '302', '303', '304', '305', '306')"
  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    console.log(querys);
    if (err) {
      return handleError(res, err);
    }
    else {
      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // var dt = endDate.split('-');
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;

      async.parallel([
        function (callback) {
          var query = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and  a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
       db.get().query(query, function (err, Watch) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, Watch);
            }
          })
        },
        function (callback) {
          var query1 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query1, function (err, pdf) {
             if (err) {
              callback(err, null);
            }
            else {
              callback(null, pdf);
            }
          })
        },function (callback) {
          var query2 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
    db.get().query(query2, function (err, audio) {
                 if (err) {
              callback(err, null);
            }
            else {
              callback(null, audio);
            }
          })
        },function (callback) {
          var query3 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query3, function (err, travel) {
                    if (err) {
              callback(err, null);
            }
            else {
              callback(null, travel);
            }
          })
        },function (callback) {
          var query4 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
          db.get().query(query4, function (err, store) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, store);
            }
          })
        },function (callback) {
          var query5 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
                db.get().query(query5, function (err, fnb) {
                             if (err) {
              callback(err, null);
            }
            else {
              callback(null, fnb);
            }
          })
        },function (callback) {
          var query6 = "SELECT b.id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.destination='" + req.query.destination + "' and a.type like '%ad%' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title";
                     db.get().query(query6, function (err, ad) {
                                                  if (err) {
              callback(err, null);
            }
            else {
              callback(null, ad);
            }
          })
        },function (callback) {
          var query7 = "SELECT Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks,menu FROM spicescreen.vuscreen_tracker where destination='" + req.query.destination + "' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu";
          db.get().query(query7, function (err, menu) {
                           if (err) {
              callback(err, null);
            }
            else {
              callback(null, menu);
            }
          })
        },
      ],
        function (err, results) {

          console.log(results.length);
          var finalData = {
                                              WATCH: results[0],
                                              PDF: results[1],
                                              AUDIO: results[2],
                                              TRAVEL: results[3],
                                              STORE: results[4],
                                              FNB: results[5],
                                              AD: results[6],
                                              MENU: results[7]
                                            }

          return res.status(200).json(finalData);
         
        });




      // var query8 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and  a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
      // db.get().query(query8, function (err, Watch) {
      //   if (err) {
      //     return handleError(res, err);
      //   }
      //   else {
      //     var query1 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
      //     db.get().query(query1, function (err, pdf) {
      //       if (err) { return handleError(res, err); }
      //       else {
      //         var query2 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";

      //         db.get().query(query2, function (err, audio) {
      //           if (err) { return handleError(res, err); }
      //           else {
      //             var query3 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";

      //             db.get().query(query3, function (err, travel) {
      //               if (err) { return handleError(res, err); }
      //               else {
      //                 var query4 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";

      //                 db.get().query(query4, function (err, store) {
      //                   if (err) { return handleError(res, err); }
      //                   else {
      //                     var query5 = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";

      //                     db.get().query(query5, function (err, fnb) {
      //                       if (err) { return handleError(res, err); }
      //                       else {
      //                         var query6 = "SELECT b.id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.destination='" + req.query.destination + "' and a.type like '%ad%' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title";

      //                         db.get().query(query6, function (err, ad) {
      //                           if (err) { return handleError(res, err); }
      //                           else {
      //                             var query7 = "SELECT Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks,menu FROM spicescreen.vuscreen_tracker where destination='" + req.query.destination + "' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu";
      //                             db.get().query(query7, function (err, menu) {
      //                               if (err) { return handleError(res, err); }
      //                               else {
      //                                 var finalData = {
      //                                   WATCH: Watch,
      //                                   PDF: pdf,
      //                                   AUDIO: audio,
      //                                   TRAVEL: travel,
      //                                   STORE: store,
      //                                   FNB: fnb,
      //                                   AD: ad,
      //                                   MENU: menu
      //                                 }
      //                                 return res.status(200).json(finalData);
      //                               }
      //                             })
      //                           }
      //                         })
      //                       }
      //                     })
      //                   }
      //                 })
      //               }
      //             })
      //           }
      //         })
      //       }
      //     })
      //   }
      // })
    }
  })
}

////////  visualize analytics by  tushar mehta  //////////////////////////////////////////

////////  actual analytics search apis  //////////////////////////////////////////

exports.vuscreen_watch = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
      var query = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1)as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          
          return res.status(200).json(Watch);
        }
      })
    }
   
 
exports.vuscreen_pdf = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query1 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query1, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_audio = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query2 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query2, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_travel = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query3 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
     db.get().query(query3, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_store = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query4 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query4, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_fnb = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query5 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query5, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_ad = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query6 = "SELECT b.id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.type  like '%ad%'  and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title"
  db.get().query(query6, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}


exports.vuscreen_menu = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query7 = "SELECT count(1) as clicks, count(distinct mac) as users, menu FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu"
     db.get().query(query7, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}

///////////////////////////////////////////////////Projected micro api//////////////////////////

exports.vuscreen_watchpro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }



  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
           db.get().query(query, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          
          return res.status(200).json(Watch);
        }
      })
    }
  })
    }
   
exports.vuscreen_pdfpro = function (req, res) {
      var startDate = 'null', endDate = 'null';
      if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
      if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

      var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
      db.get().query(querys, function (err, device) {
        // console.log(err);
        if (err) {
          return handleError(res, err);
        }
        else {
    
          var div = 0;
          for (let dat in device) {
            div += parseInt(device[dat].device);
          }
          // console.log(div);
          // var div = parseInt(device[0].device);
          var mul = 163 * 31;
    

          var query1 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='pdf' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
          db.get().query(query1, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          
          return res.status(200).json(Watch);
        }
      })
    }
  })
}

exports.vuscreen_audiopro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query2 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_read_content AS b ON a.view_id = b.content_id where a.type='audio' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query2, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          
          return res.status(200).json(Watch);
    }
  })
}
})
}

exports.vuscreen_travelpro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query3 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_travel_content AS b ON a.view_id = b.content_id where a.type='TRAVEL' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
     db.get().query(query3, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}
})
}

exports.vuscreen_storepro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query4 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_store_content AS b ON a.view_id = b.content_id where a.menu='STORE' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
  db.get().query(query4, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}
})
}

exports.vuscreen_fnbpro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query5 = "SELECT b.content_id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_fnb_content AS b ON a.view_id = b.content_id where a.menu='f&b' and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title"
      db.get().query(query5, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          
          return res.status(200).json(Watch);
    }
  })
}
})
}

exports.vuscreen_adpro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query6 = "SELECT b.id, b.title, count(distinct mac) as users, count(1) as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_advertise_content AS b ON a.view_id = b.id where a.type  like '%ad%'  and a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' or a.menu like '%ad%' group by b.id, b.title"
  db.get().query(query6, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}
})
}

exports.vuscreen_menupro = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;


      var query7 = "SELECT count(1) as clicks, count(distinct mac) as users, menu FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by menu"
     db.get().query(query7, function (err, Watch) {
    if (err) {
      callback(err, null);
    }
    else {
      
      return res.status(200).json(Watch);
    }
  })
}
})
}

///////////////////////////////////////destination projected api//////////////////////////////////////
exports.vuscreen_watchdes = function (req, res) {
  console.log("vishall");
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    console.log(querys);
    if (err) {
      return handleError(res, err);
    }
    else {
      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // var dt = endDate.split('-');
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;



      var query = "SELECT b.content_id, b.title, Round((count(distinct mac)/" + div + ")*" + mul + ") as users, Round((count(1)/" + div + ")*" + mul + ") as clicks FROM spicescreen.vuscreen_tracker AS a JOIN spicescreen.vuscreen_content_package AS b ON a.view_id = b.content_id where a.destination='" + req.query.destination + "' and  a.sync_date>='" + startDate + "' and a.sync_date<='" + endDate + "' group by b.content_id, b.title";
       db.get().query(query, function (err, Watch) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, Watch);
    }
  })
}
})
}



////////  actual analytics search apis  //////////////////////////////////////////

////////  prorated analytics search apis  //////////////////////////////////////////



exports.wifi_login = function (req, res) {
  // var wifi_login_sync = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  //   var currentDate = moment(new Date()).format('YYYY-MM-DD');
  //   var d = new Date();
  // // var Yesterday='2020-10-30';
  // // var Yesterdays='2020-10-01';

  //   d.setDate(d.getDate() - 1);
  //   var Yesterday = moment(d).format('YYYY-MM-DD').toString()
  var query = "SELECT distinct b.vehicle_no, a.event, a.view_datetime, a.journey_id,unique_mac_address FROM spicescreen.vuscreen_events a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date >= '" + startDate + "' and a.sync_date <= '" + endDate + "' AND a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC";

  db.get().query(query, function (err, doc) {
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    else {


      var data = ""
      let wifiMap = new Map();
      let a = []
      var count = 0;
      //  console.log(doc.length);
      for (let i = 0; i < doc.length; i++) {
        data += doc[i].unique_mac_address + ",";
        //  console.log(doc[i].unique_mac_address)

        if (doc.length == i + 1) {


          var data1 = data.split(',');
          // console.log(data1.length);

          for (let j = 0; j < data1.length; j++) {
            const element = data1[j];

            wifiMap.set(element, element)

            if (data1.length == j + 1) {
              // console.log(j);
              // console.log(wifiMap.size)
              // console.log( wifiMap);
              count = wifiMap.size
              function logMapElements(value, key, map) {

                a.push({ "macaddress": value })
                // console.log(`m[${key}] = ${value}`);
              }
              wifiMap.forEach(logMapElements);
            }

          }
          // console.log(wifiMap);
          // console.log(wifiMap.size)
          count = wifiMap.size;
        }
      }


      return res.status(200).json(count);
    }
  })
};
// vuscreen_analyticsvu_des()

exports.wifi_login_pro = function (req, res, next) {
  async function app() {
    console.log("vishalalaa");
    // var currentDate = moment(new Date()).format('YYYY-MM-DD');
    // var d = new Date();
    // d.setDate(d.getDate() - 1);
    // var Yesterday = moment(d).format('YYYY-MM-DD').toString()

    var startDate = 'null', endDate = 'null';
    if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
    if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
    var mul = 152 * 31;
    let doc = await get_host(startDate, endDate);
    console.log(doc);
    let doc1 = await get_login(startDate, endDate);
    let doc2 = await get_login_unique(doc1);
    var total = Math.round((doc2 / doc) * mul);

    return res.status(200).json(total);

    //   res.status("200").json(insert);

  }
  app();

};

exports.wifi_login_act = function (req, res, next) {
  async function app() {
    // var currentDate = moment(new Date()).format('YYYY-MM-DD');
    // var d = new Date();
    // d.setDate(d.getDate() - 1);
    // var Yesterday = moment(d).format('YYYY-MM-DD').toString()

    var startDate = 'null', endDate = 'null';
    if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
    if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
    var mul = 152 * 31;
    // let doc = await get_host(startDate,endDate);
    let doc1 = await get_login(startDate, endDate);
    let doc2 = await get_login_unique(doc1);
    // var total=(doc2/doc)*mul;

    return res.status(200).json(doc2);

    //   res.status("200").json(insert);

  }
  app();

};
//  vuscreen_basestation()
function get_host(startDate, endDate) {
  return new Promise(function (myResolve, myReject) {
    let query = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
    db.get().query(query, function (err, device) {
      if (err) { myResolve(err) }
      else {
        var div = 0;
        for (let dat in device) {
          div += parseInt(device[dat].device);
        }
        myResolve(div);
      }
    })

  });

}

//  vuscreen_basestation()
function get_login(startDate, endDate) {
  return new Promise(function (myResolve, myReject) {
    let query = "SELECT distinct b.vehicle_no, a.event, a.view_datetime, a.journey_id,unique_mac_address FROM spicescreen.vuscreen_events a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date >= '" + startDate + "' and a.sync_date <= '" + endDate + "' AND a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC";
    db.get().query(query, function (err, device) {
      if (err) { myResolve(err) }
      else {

        myResolve(device);
      }
    })

  });

}


function get_login_unique(doc) {
  return new Promise(function (myResolve, myReject) {

    var data = ""
    let wifiMap = new Map();
    let a = []
    var count = 0;
    //  console.log(doc.length);
    for (let i = 0; i < doc.length; i++) {
      data += doc[i].unique_mac_address + ",";
      //  console.log(doc[i].unique_mac_address)

      if (doc.length == i + 1) {


        var data1 = data.split(',');
        // console.log(data1.length);

        for (let j = 0; j < data1.length; j++) {
          const element = data1[j];

          wifiMap.set(element, element)

          if (data1.length == j + 1) {
            // console.log(j);
            // console.log(wifiMap.size)
            // console.log( wifiMap);
            count = wifiMap.size
            function logMapElements(value, key, map) {

              a.push({ "macaddress": value })
              // console.log(`m[${key}] = ${value}`);
            }
            wifiMap.forEach(logMapElements);
          }

        }
        // console.log(wifiMap);
        // console.log(wifiMap.size)
        count = wifiMap.size;
        myResolve(count);
      }
    }

  });

}

exports.get_ss = function (req, res) {
  var startDate, endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var query = "select "
    + " count(distinct mac) count"
    + " from"
    + " vuscreen_tracker "
    + " where menu = 'SS' AND"
    + " sync_date>='" + startDate + "' AND sync_date<='" + endDate + "'"
  console.log(query)
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

///////////////////Summary Api's//////////////////////////////

exports.vuscreen_actual_summary = function (req, res) {
  // var vuscreen_actual_summary = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }


  async.parallel([
    function (callback) {
      var query = "SELECT count(distinct device_id) as Totaldevicesync FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          callback(null, Watch);
        }
      })
    },
    function (callback) {
      var query1 = "SELECT count(distinct mac) as Totalhomepagelogin FROM spicescreen.vuscreen_tracker where menu='SS' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
  db.get().query(query1, function (err, pdf) {
         if (err) {
          callback(err, null);
        }
        else {
          callback(null, pdf);
        }
      })
    },function (callback) {
      var query2 = "SELECT count(1) as Totalclick FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query2, function (err, audio) {
             if (err) {
          callback(err, null);
        }
        else {
          callback(null, audio);
        }
      })
    },
    function (callback) {
      var query3 = "SELECT count(1) as TotalAdclick FROM spicescreen.vuscreen_tracker where menu='AD' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query3, function (err, AD) {
             if (err) {
          callback(err, null);
        }
        else {
          callback(null, AD);
        }
      })
    },
  ],
  function (err, results) {

    console.log(results.length);
    var finalData = {
                                        WATCH: results[0],
                                        PDF: results[1],
                                        AUDIO: results[2],
                                        AD: results[3]
                                      }
                                      console.log(finalData);

    return res.status(200).json(finalData);
   
  });

}
// vuscreen_actual_summary();

exports.vuscreen_projected_summary = function (req, res) {
  // var vuscreen_projected_summary = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }

var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;

  async.parallel([
    function (callback) {
      var query = "SELECT count(distinct device_id) as Totaldevicesync FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query, function (err, Watch) {
        if (err) {
          callback(err, null);
        }
        else {
          callback(null, Watch);
        }
      })
    },
    function (callback) {
      var query1 = "SELECT Round((count(distinct mac)/" + div + ")*" + mul + ") as Totalhomepagelogin FROM spicescreen.vuscreen_tracker where menu='SS' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
  db.get().query(query1, function (err, pdf) {
         if (err) {
          callback(err, null);
        }
        else {
          callback(null, pdf);
        }
      })
    },function (callback) {
      var query2 = "SELECT Round((count(1)/" + div + ")*" + mul + ") as Totalclick FROM spicescreen.vuscreen_tracker where sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query2, function (err, audio) {
             if (err) {
          callback(err, null);
        }
        else {
          callback(null, audio);
        }
      })
    },
    function (callback) {
      var query3 = "SELECT  Round((count(1)/" + div + ")*" + mul + ") as totalAdclick FROM spicescreen.vuscreen_tracker where menu='AD' and sync_date>='" + startDate + "' and sync_date<='" + endDate + "'"
      db.get().query(query3, function (err, AD) {
             if (err) {
          callback(err, null);
        }
        else {
          callback(null, AD);
        }
      })
    },
  ],
  function (err, results) {

    console.log(results.length);
    var finalData = {
                                        WATCH: results[0],
                                        PDF: results[1],
                                        AUDIO: results[2],
                                        AD: results[3]
                                        
                                      }
console.log(finalData);
    return res.status(200).json(finalData);
   
  });

  
    }

  })
}
// vuscreen_projected_summary();


exports.wifi_login = function (req, res) {
  // var wifi_login_sync = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  //   var currentDate = moment(new Date()).format('YYYY-MM-DD');
  //   var d = new Date();
  // // var Yesterday='2020-10-30';
  // // var Yesterdays='2020-10-01';

  //   d.setDate(d.getDate() - 1);
  //   var Yesterday = moment(d).format('YYYY-MM-DD').toString()
  var querys = "SELECT count(distinct device_id) as device,sync_date FROM spicescreen.vuscreen_tracker  where sync_date>='" + startDate + "' and sync_date<='" + endDate + "' group by sync_date";
  db.get().query(querys, function (err, device) {
    // console.log(err);
    if (err) {
      return handleError(res, err);
    }
    else {

      var div = 0;
      for (let dat in device) {
        div += parseInt(device[dat].device);
      }
  
      // console.log(div);
      // var div = parseInt(device[0].device);
      var mul = 163 * 31;
  var query = "SELECT distinct b.vehicle_no, a.event, a.view_datetime, a.journey_id,unique_mac_address FROM spicescreen.vuscreen_events a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date >= '" + startDate + "' and a.sync_date <= '" + endDate + "' AND a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC";

  db.get().query(query, function (err, doc) {
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    else {


      var data = ""
      let wifiMap = new Map();
      let a = []
      var count = 0;
      //  console.log(doc.length);
      for (let i = 0; i < doc.length; i++) {
        data += doc[i].unique_mac_address + ",";
        //  console.log(doc[i].unique_mac_address)

        if (doc.length == i + 1) {


          var data1 = data.split(',');
          // console.log(data1.length);

          for (let j = 0; j < data1.length; j++) {
            const element = data1[j];

            wifiMap.set(element, element)

            if (data1.length == j + 1) {
              // console.log(j);
              // console.log(wifiMap.size)
              // console.log( wifiMap);
              count = wifiMap.size
              function logMapElements(value, key, map) {

                a.push({ "macaddress": value })
                // console.log(`m[${key}] = ${value}`);
              }
              wifiMap.forEach(logMapElements);
            }

          }
          // console.log(wifiMap);
          // console.log(wifiMap.size)
          count = wifiMap.size;
          count= Math.round((count/div)*mul);
          console.log(count);
        }
      }


      return res.status(200).json(count);
    }
  })
}
})
};

// wifi_login_sync();











