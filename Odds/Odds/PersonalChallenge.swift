//
//  PersonalChallenge.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class PersonalChallenge: Challenge {
    private var toUser: User
    
    init(uid: Int, fromUser: User, toUser: User, desc: String, date: NSDate) {
        self.toUser = toUser
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date)
    }
    
    init(uid: Int, fromUser: User, toUser: User, desc: String, revenge: Int, date: NSDate) {
        self.toUser = toUser
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date, revenge: revenge)
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
