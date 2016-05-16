var expect = require('chai').expect
var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Loading express server', function(done){
    var server

    beforeEach(function () {
        server = require('./index')
    })

    afterEach(function () {
        server.close()
    })

    it('should return articles in array', function(){
        request(server)
        .get('/articles')
        .expect(function(res) {
            res.should.be.instanceof(Array)
        })
        .expect(200, done)
    })

    it('should post an article', function(){
        request(server)
        .post('/articles')
        .field('header', 'Hello')
        .field('content', 'Lorem ipsum')
        .expect(200, done)
    })
})
