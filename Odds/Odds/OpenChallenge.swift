//
//  OpenChallenge.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class OpenChallenge: Challenge {
    private var upvotes: Int
    private var downvotes: Int
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate, upvotes: Int, downvotes: Int) {
        self.upvotes = upvotes
        self.downvotes = downvotes
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date)
    }
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate, revenge: Int, upvotes: Int, downvotes: Int) {
        self.upvotes = upvotes
        self.downvotes = downvotes
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date, revenge: revenge)
    }
    
    func getUpvotes() -> Int {
        return self.upvotes
    }
    
    func getDownvotes() -> Int {
        return self.downvotes
    }
    
    func acceptChallenge() -> Bool{
        //implement
        
        return false
    }
    
    func rejectChallenge() -> Bool{
        //implement
        
        return false
    }
}
