//
//  AcceptedRequest.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class AcceptedRequest: Challenge {
    private var maxOddsValue: Int
    private var challengerNumber: Int
    private var challengeeNumber: Int
    private var toUser: User
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate, maxOddsValue: Int, challengerNumber: Int, challengeeNumber: Int, toUser: User) {
        self.maxOddsValue = maxOddsValue
        self.challengerNumber = challengerNumber
        self.challengeeNumber = challengeeNumber
        self.toUser = toUser
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date)
    }
    
    init(uid: Int, fromUser: User, desc: String, date: NSDate, revenge: Int, maxOddsValue: Int, challengerNumber: Int, challengeeNumber: Int, toUser: User) {
        self.maxOddsValue = maxOddsValue
        self.challengerNumber = challengerNumber
        self.challengeeNumber = challengeeNumber
        self.toUser = toUser
        super.init(uid: uid, fromUser: fromUser, desc: desc, date: date)
    }
}
