$(document).ready(function(){

	$('.control').on({
	
		'click': function(){
		
			var guiElement = $(this);
		
			var control = guiElement.attr('data-control');
			var data = guiElement.attr('data-data');
		
			$.post('api', {control:control,data:data}, function(result){
				
				var response = JSON.parse(result);

				switch(response.gui){
					
					case 'sourcesPreset':
						$('.sourcesPreset').removeClass('active');
						guiElement.addClass('active');
					break;
					
					case 'fluxusScene':
						$('.fluxusScene').removeClass('active');
						guiElement.addClass('active');
					break;
					
					default:
					//$('#result').html(response.message);
				
				}
				
				$('#result').html(response.message);				
					
				
			})
	
		}

	});

});
