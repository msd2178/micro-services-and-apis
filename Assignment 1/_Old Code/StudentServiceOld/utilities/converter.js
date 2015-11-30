'use strict';

function transformError(status, message) {
	return {
		type: "err",
		errors: [{
			version: "v1",
			status: status,
			message: message
		}]
	}
}

function studentDBToJSON(results) {
	// convert to mentioned schema as per TLDS

	let data = {};

	if(results instanceof Array){
		data = {
			type: "students",
			"students": []
		};
		results.forEach((result) => {
			data.students.push(generateStudent(result));
		})
	} else {
		data = generateStudent(results);
	}

	function generateStudent (student) {
		if(student) {
			return {
				type: "student",
				studentID: student.studentID,
				data: {
					name: {
						lastName: student.name.lastName,
						firstName: student.name.firstName
					},
					degree: student.degree,
					major: student.major,
					courses: student.courses,
					version: student.version,
					link: {
						rel: "self",
						href: `/api/v1/students/${student.studentID}`
					}
				}
			};	
		} else {
			return {};
		}
	}
	return data;
}

function eventGenerator (type, studentID, courseID, version) {
    return {
        "type": type,
        "data": {
        	"studentID": studentID,
            "courseID": courseID
        },
        "version": version
    };
} 

module.exports.transformError = transformError;
module.exports.studentDBToJSON	 = studentDBToJSON;
module.exports.eventGenerator = eventGenerator; 